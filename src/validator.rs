use crate::schema::{Schema, ValidationError, ValidationResult};
use serde_json::Value;
use std::collections::HashMap;

/// Main validator that processes schema against JSON values
pub struct Validator;

impl Validator {
    /// Validate a value against a schema
    pub fn validate(schema: &Schema, value: &Value) -> ValidationResult {
        Self::validate_with_path(schema, value, &[])
    }

    /// Validate a value at a specific path in the schema
    pub fn validate_at_path(
        schema: &Schema,
        value: &Value,
        path: &[String],
    ) -> ValidationResult {
        if path.is_empty() {
            return Self::validate(schema, value);
        }

        // Navigate to the target schema
        let target_schema = Self::navigate_schema(schema, path)?;
        
        // Navigate to the target value
        let target_value = Self::navigate_value(value, path);
        
        Self::validate_with_path(target_schema, target_value, path)
    }

    /// Internal validation with path tracking
    fn validate_with_path(
        schema: &Schema,
        value: &Value,
        path: &[String],
    ) -> ValidationResult {
        let mut errors = Vec::new();

        match schema {
            Schema::String { min, max, email, url, pattern, messages, .. } => {
                if let Some(s) = value.as_str() {
                    Self::validate_string(s, *min, *max, *email, *url, pattern.as_deref(), messages, path, &mut errors);
                } else {
                    let msg = messages
                        .as_ref()
                        .and_then(|m| m.invalid_type.as_deref())
                        .unwrap_or("Expected string");
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        msg,
                    ));
                }
            }
            Schema::Number { min, max, integer, positive, messages, .. } => {
                if let Some(n) = value.as_f64() {
                    Self::validate_number(n, *min, *max, *integer, *positive, messages, path, &mut errors);
                } else {
                    let msg = messages
                        .as_ref()
                        .and_then(|m| m.invalid_type.as_deref())
                        .unwrap_or("Expected number");
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        msg,
                    ));
                }
            }
            Schema::Boolean { messages, .. } => {
                if !value.is_boolean() {
                    let msg = messages
                        .as_ref()
                        .and_then(|m| m.invalid_type.as_deref())
                        .unwrap_or("Expected boolean");
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        msg,
                    ));
                }
            }
            Schema::Object { shape, messages, .. } => {
                if let Some(obj) = value.as_object() {
                    Self::validate_object(shape, obj, messages, path, &mut errors);
                } else {
                    let msg = messages
                        .as_ref()
                        .and_then(|m| m.invalid_type.as_deref())
                        .unwrap_or("Expected object");
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        msg,
                    ));
                }
            }
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }

    /// Validate string constraints
    fn validate_string(
        s: &str,
        min: Option<usize>,
        max: Option<usize>,
        email: Option<bool>,
        url: Option<bool>,
        pattern: Option<&str>,
        messages: &Option<crate::schema::StringMessages>,
        path: &[String],
        errors: &mut Vec<ValidationError>,
    ) {
        if let Some(min_len) = min {
            if s.len() < min_len {
                let msg = messages
                    .as_ref()
                    .and_then(|m| m.min.as_deref())
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| format!("String must be at least {} characters", min_len));
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "string.min",
                    msg,
                ));
            }
        }

        if let Some(max_len) = max {
            if s.len() > max_len {
                let msg = messages
                    .as_ref()
                    .and_then(|m| m.max.as_deref())
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| format!("String must be at most {} characters", max_len));
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "string.max",
                    msg,
                ));
            }
        }

        if email == Some(true) && !Self::is_valid_email(s) {
            let msg = messages
                .as_ref()
                .and_then(|m| m.email.as_deref())
                .unwrap_or("Invalid email address");
            errors.push(ValidationError::new(
                path.to_vec(),
                "string.email",
                msg,
            ));
        }

        if url == Some(true) && !Self::is_valid_url(s) {
            let msg = messages
                .as_ref()
                .and_then(|m| m.url.as_deref())
                .unwrap_or("Invalid URL");
            errors.push(ValidationError::new(
                path.to_vec(),
                "string.url",
                msg,
            ));
        }

        if let Some(regex_pattern) = pattern {
            // Basic pattern matching (in production, use regex crate)
            if !s.contains(regex_pattern) {
                let msg = messages
                    .as_ref()
                    .and_then(|m| m.pattern.as_deref())
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| format!("String does not match pattern: {}", regex_pattern));
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "string.pattern",
                    msg,
                ));
            }
        }
    }

    /// Validate number constraints
    fn validate_number(
        n: f64,
        min: Option<f64>,
        max: Option<f64>,
        integer: Option<bool>,
        positive: Option<bool>,
        messages: &Option<crate::schema::NumberMessages>,
        path: &[String],
        errors: &mut Vec<ValidationError>,
    ) {
        if let Some(min_val) = min {
            if n < min_val {
                let msg = messages
                    .as_ref()
                    .and_then(|m| m.min.as_deref())
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| format!("Number must be at least {}", min_val));
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "number.min",
                    msg,
                ));
            }
        }

        if let Some(max_val) = max {
            if n > max_val {
                let msg = messages
                    .as_ref()
                    .and_then(|m| m.max.as_deref())
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| format!("Number must be at most {}", max_val));
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "number.max",
                    msg,
                ));
            }
        }

        if integer == Some(true) && n.fract() != 0.0 {
            let msg = messages
                .as_ref()
                .and_then(|m| m.integer.as_deref())
                .unwrap_or("Number must be an integer");
            errors.push(ValidationError::new(
                path.to_vec(),
                "number.integer",
                msg,
            ));
        }

        if positive == Some(true) && n <= 0.0 {
            let msg = messages
                .as_ref()
                .and_then(|m| m.positive.as_deref())
                .unwrap_or("Number must be positive");
            errors.push(ValidationError::new(
                path.to_vec(),
                "number.positive",
                msg,
            ));
        }
    }

    /// Validate object shape
    fn validate_object(
        shape: &HashMap<String, Schema>,
        obj: &serde_json::Map<String, Value>,
        messages: &Option<crate::schema::ObjectMessages>,
        path: &[String],
        errors: &mut Vec<ValidationError>,
    ) {
        for (key, field_schema) in shape {
            let field_path: Vec<String> = path.iter().cloned().chain(std::iter::once(key.clone())).collect();
            
            if let Some(field_value) = obj.get(key) {
                if let Err(field_errors) = Self::validate_with_path(field_schema, field_value, &field_path) {
                    errors.extend(field_errors);
                }
            } else {
                let msg = messages
                    .as_ref()
                    .and_then(|m| m.required.as_deref())
                    .map(|m| m.to_string())
                    .unwrap_or_else(|| format!("Field '{}' is required", key));
                errors.push(ValidationError::new(
                    field_path,
                    "required",
                    msg,
                ));
            }
        }
    }

    /// Navigate to a schema at a given path
    fn navigate_schema<'a>(
        schema: &'a Schema,
        path: &[String],
    ) -> Result<&'a Schema, Vec<ValidationError>> {
        let mut current = schema;

        for segment in path {
            match current {
                Schema::Object { shape, .. } => {
                    current = shape.get(segment).ok_or_else(|| {
                        vec![ValidationError::new(
                            vec![segment.clone()],
                            "invalid_path",
                            format!("Path segment '{}' not found in schema", segment),
                        )]
                    })?;
                }
                _ => {
                    return Err(vec![ValidationError::new(
                        vec![segment.clone()],
                        "invalid_path",
                        "Cannot navigate non-object schema",
                    )]);
                }
            }
        }

        Ok(current)
    }

    /// Navigate to a value at a given path
    fn navigate_value<'a>(value: &'a Value, path: &[String]) -> &'a Value {
        let mut current = value;

        for segment in path {
            if let Some(obj) = current.as_object() {
                current = obj.get(segment).unwrap_or(&Value::Null);
            } else {
                return &Value::Null;
            }
        }

        current
    }

    /// Simple email validation (RFC 5322 compliant in production)
    fn is_valid_email(s: &str) -> bool {
        s.contains('@') && s.split('@').count() == 2 && !s.starts_with('@') && !s.ends_with('@')
    }

    /// Simple URL validation
    fn is_valid_url(s: &str) -> bool {
        s.starts_with("http://") || s.starts_with("https://")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_string_validation() {
        let schema = Schema::String {
            min: Some(3),
            max: Some(10),
            email: None,
            url: None,
            pattern: None,
            ui: None,
            messages: None,
        };

        assert!(Validator::validate(&schema, &json!("hello")).is_ok());
        assert!(Validator::validate(&schema, &json!("hi")).is_err());
        assert!(Validator::validate(&schema, &json!("verylongstring")).is_err());
    }

    #[test]
    fn test_email_validation() {
        let schema = Schema::String {
            min: None,
            max: None,
            email: Some(true),
            url: None,
            pattern: None,
            ui: None,
            messages: None,
        };

        assert!(Validator::validate(&schema, &json!("test@example.com")).is_ok());
        assert!(Validator::validate(&schema, &json!("invalid")).is_err());
    }

    #[test]
    fn test_number_validation() {
        let schema = Schema::Number {
            min: Some(0.0),
            max: Some(100.0),
            integer: Some(true),
            positive: None,
            ui: None,
            messages: None,
        };

        assert!(Validator::validate(&schema, &json!(50)).is_ok());
        assert!(Validator::validate(&schema, &json!(-1)).is_err());
        assert!(Validator::validate(&schema, &json!(50.5)).is_err());
    }

    #[test]
    fn test_object_validation() {
        let mut shape = HashMap::new();
        shape.insert(
            "name".to_string(),
            Schema::String {
                min: Some(1),
                max: None,
                email: None,
                url: None,
                pattern: None,
                ui: None,
                messages: None,
            },
        );
        shape.insert(
            "age".to_string(),
            Schema::Number {
                min: Some(0.0),
                max: None,
                integer: Some(true),
                positive: Some(true),
                ui: None,
                messages: None,
            },
        );

        let schema = Schema::Object { shape, ui: None, messages: None };

        assert!(Validator::validate(&schema, &json!({"name": "John", "age": 30})).is_ok());
        assert!(Validator::validate(&schema, &json!({"name": "", "age": 30})).is_err());
        assert!(Validator::validate(&schema, &json!({"name": "John"})).is_err());
    }

    #[test]
    fn test_validate_at_path() {
        let mut shape = HashMap::new();
        shape.insert(
            "email".to_string(),
            Schema::String {
                min: Some(3),
                max: None,
                email: Some(true),
                url: None,
                pattern: None,
                ui: None,
                messages: None,
            },
        );

        let schema = Schema::Object { shape, ui: None, messages: None };
        let value = json!({"email": "test@example.com"});

        assert!(Validator::validate_at_path(&schema, &value, &["email".to_string()]).is_ok());
        
        let invalid_value = json!({"email": "invalid"});
        assert!(Validator::validate_at_path(&schema, &invalid_value, &["email".to_string()]).is_err());
    }

    #[test]
    fn test_custom_string_messages() {
        use crate::schema::StringMessages;
        
        let messages = StringMessages {
            invalid_type: Some("Custom: not a string".to_string()),
            min: Some("Custom: too short".to_string()),
            max: Some("Custom: too long".to_string()),
            email: Some("Custom: bad email".to_string()),
            url: None,
            pattern: None,
        };

        let schema = Schema::String {
            min: Some(5),
            max: Some(10),
            email: Some(true),
            url: None,
            pattern: None,
            ui: None,
            messages: Some(messages),
        };

        // Test invalid type
        let result = Validator::validate(&schema, &json!(123));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert_eq!(errors[0].message, "Custom: not a string");

        // Test min length
        let result = Validator::validate(&schema, &json!("abc"));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: too short"));

        // Test max length
        let result = Validator::validate(&schema, &json!("verylongstring"));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: too long"));

        // Test email
        let result = Validator::validate(&schema, &json!("hello"));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: bad email"));
    }

    #[test]
    fn test_custom_number_messages() {
        use crate::schema::NumberMessages;
        
        let messages = NumberMessages {
            invalid_type: Some("Custom: not a number".to_string()),
            min: Some("Custom: too small".to_string()),
            max: Some("Custom: too large".to_string()),
            integer: Some("Custom: must be whole number".to_string()),
            positive: Some("Custom: must be positive".to_string()),
        };

        let schema = Schema::Number {
            min: Some(10.0),
            max: Some(100.0),
            integer: Some(true),
            positive: Some(true),
            ui: None,
            messages: Some(messages),
        };

        // Test invalid type
        let result = Validator::validate(&schema, &json!("not a number"));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert_eq!(errors[0].message, "Custom: not a number");

        // Test min value
        let result = Validator::validate(&schema, &json!(5));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: too small"));

        // Test max value
        let result = Validator::validate(&schema, &json!(150));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: too large"));

        // Test integer
        let result = Validator::validate(&schema, &json!(50.5));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: must be whole number"));

        // Test positive
        let result = Validator::validate(&schema, &json!(-10));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert!(errors.iter().any(|e| e.message == "Custom: must be positive"));
    }

    #[test]
    fn test_custom_object_messages() {
        use crate::schema::ObjectMessages;
        
        let messages = ObjectMessages {
            invalid_type: Some("Custom: not an object".to_string()),
            required: Some("Custom: field is required".to_string()),
        };

        let mut shape = HashMap::new();
        shape.insert(
            "name".to_string(),
            Schema::String {
                min: None,
                max: None,
                email: None,
                url: None,
                pattern: None,
                ui: None,
                messages: None,
            },
        );

        let schema = Schema::Object { 
            shape, 
            ui: None, 
            messages: Some(messages) 
        };

        // Test invalid type
        let result = Validator::validate(&schema, &json!("not an object"));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert_eq!(errors[0].message, "Custom: not an object");

        // Test required field
        let result = Validator::validate(&schema, &json!({}));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert_eq!(errors[0].message, "Custom: field is required");
    }

    #[test]
    fn test_default_messages_when_custom_not_provided() {
        let schema = Schema::String {
            min: Some(5),
            max: None,
            email: None,
            url: None,
            pattern: None,
            ui: None,
            messages: None,
        };

        let result = Validator::validate(&schema, &json!("abc"));
        assert!(result.is_err());
        let errors = result.unwrap_err();
        assert_eq!(errors[0].message, "String must be at least 5 characters");
    }
}
