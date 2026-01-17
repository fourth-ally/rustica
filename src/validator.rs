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
            Schema::String { min, max, email, url, pattern, .. } => {
                if let Some(s) = value.as_str() {
                    Self::validate_string(s, *min, *max, *email, *url, pattern.as_deref(), path, &mut errors);
                } else {
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        "Expected string",
                    ));
                }
            }
            Schema::Number { min, max, integer, positive, .. } => {
                if let Some(n) = value.as_f64() {
                    Self::validate_number(n, *min, *max, *integer, *positive, path, &mut errors);
                } else {
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        "Expected number",
                    ));
                }
            }
            Schema::Boolean { .. } => {
                if !value.is_boolean() {
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        "Expected boolean",
                    ));
                }
            }
            Schema::Object { shape, .. } => {
                if let Some(obj) = value.as_object() {
                    Self::validate_object(shape, obj, path, &mut errors);
                } else {
                    errors.push(ValidationError::new(
                        path.to_vec(),
                        "invalid_type",
                        "Expected object",
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
        path: &[String],
        errors: &mut Vec<ValidationError>,
    ) {
        if let Some(min_len) = min {
            if s.len() < min_len {
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "string.min",
                    format!("String must be at least {} characters", min_len),
                ));
            }
        }

        if let Some(max_len) = max {
            if s.len() > max_len {
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "string.max",
                    format!("String must be at most {} characters", max_len),
                ));
            }
        }

        if email == Some(true) && !Self::is_valid_email(s) {
            errors.push(ValidationError::new(
                path.to_vec(),
                "string.email",
                "Invalid email address",
            ));
        }

        if url == Some(true) && !Self::is_valid_url(s) {
            errors.push(ValidationError::new(
                path.to_vec(),
                "string.url",
                "Invalid URL",
            ));
        }

        if let Some(regex_pattern) = pattern {
            // Basic pattern matching (in production, use regex crate)
            if !s.contains(regex_pattern) {
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "string.pattern",
                    format!("String does not match pattern: {}", regex_pattern),
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
        path: &[String],
        errors: &mut Vec<ValidationError>,
    ) {
        if let Some(min_val) = min {
            if n < min_val {
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "number.min",
                    format!("Number must be at least {}", min_val),
                ));
            }
        }

        if let Some(max_val) = max {
            if n > max_val {
                errors.push(ValidationError::new(
                    path.to_vec(),
                    "number.max",
                    format!("Number must be at most {}", max_val),
                ));
            }
        }

        if integer == Some(true) && n.fract() != 0.0 {
            errors.push(ValidationError::new(
                path.to_vec(),
                "number.integer",
                "Number must be an integer",
            ));
        }

        if positive == Some(true) && n <= 0.0 {
            errors.push(ValidationError::new(
                path.to_vec(),
                "number.positive",
                "Number must be positive",
            ));
        }
    }

    /// Validate object shape
    fn validate_object(
        shape: &HashMap<String, Schema>,
        obj: &serde_json::Map<String, Value>,
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
                errors.push(ValidationError::new(
                    field_path,
                    "required",
                    format!("Field '{}' is required", key),
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
            },
        );

        let schema = Schema::Object { shape, ui: None };

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
            },
        );

        let schema = Schema::Object { shape, ui: None };
        let value = json!({"email": "test@example.com"});

        assert!(Validator::validate_at_path(&schema, &value, &["email".to_string()]).is_ok());
        
        let invalid_value = json!({"email": "invalid"});
        assert!(Validator::validate_at_path(&schema, &invalid_value, &["email".to_string()]).is_err());
    }
}
