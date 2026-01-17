use wasm_bindgen::prelude::*;
use crate::schema::Schema;
use crate::validator::Validator;

/// WASM interface for validation
/// 
/// This module exposes exactly two functions to JavaScript:
/// - validate: validates entire data against schema
/// - validate_at_path: validates data at a specific path
/// 
/// Both functions accept and return JSON strings for zero-copy performance
#[wasm_bindgen]
pub struct WasmValidator;

#[wasm_bindgen]
impl WasmValidator {
    /// Validate data against a schema
    /// 
    /// # Arguments
    /// * `schema_json` - JSON string representing the schema AST
    /// * `value_json` - JSON string representing the data to validate
    /// 
    /// # Returns
    /// JSON string with validation result:
    /// - Success: `{"success": true}`
    /// - Error: `{"success": false, "errors": [...]}`
    #[wasm_bindgen]
    pub fn validate(schema_json: &str, value_json: &str) -> String {
        match Self::validate_internal(schema_json, value_json) {
            Ok(_) => {
                serde_json::json!({
                    "success": true
                })
                .to_string()
            }
            Err(errors) => {
                serde_json::json!({
                    "success": false,
                    "errors": errors
                })
                .to_string()
            }
        }
    }

    /// Validate data at a specific path in the schema
    /// 
    /// # Arguments
    /// * `schema_json` - JSON string representing the schema AST
    /// * `value_json` - JSON string representing the data to validate
    /// * `path_json` - JSON array of path segments as strings
    /// 
    /// # Returns
    /// JSON string with validation result (same format as validate)
    #[wasm_bindgen]
    pub fn validate_at_path(schema_json: &str, value_json: &str, path_json: &str) -> String {
        match Self::validate_at_path_internal(schema_json, value_json, path_json) {
            Ok(_) => {
                serde_json::json!({
                    "success": true
                })
                .to_string()
            }
            Err(errors) => {
                serde_json::json!({
                    "success": false,
                    "errors": errors
                })
                .to_string()
            }
        }
    }

    /// Internal validation logic
    fn validate_internal(
        schema_json: &str,
        value_json: &str,
    ) -> Result<(), Vec<crate::schema::ValidationError>> {
        // Parse schema
        let schema: Schema = serde_json::from_str(schema_json)
            .map_err(|e| {
                vec![crate::schema::ValidationError::new(
                    vec![],
                    "parse_error",
                    format!("Invalid schema JSON: {}", e),
                )]
            })?;

        // Parse value
        let value: serde_json::Value = serde_json::from_str(value_json)
            .map_err(|e| {
                vec![crate::schema::ValidationError::new(
                    vec![],
                    "parse_error",
                    format!("Invalid value JSON: {}", e),
                )]
            })?;

        // Validate
        Validator::validate(&schema, &value)
    }

    /// Internal path validation logic
    fn validate_at_path_internal(
        schema_json: &str,
        value_json: &str,
        path_json: &str,
    ) -> Result<(), Vec<crate::schema::ValidationError>> {
        // Parse schema
        let schema: Schema = serde_json::from_str(schema_json)
            .map_err(|e| {
                vec![crate::schema::ValidationError::new(
                    vec![],
                    "parse_error",
                    format!("Invalid schema JSON: {}", e),
                )]
            })?;

        // Parse value
        let value: serde_json::Value = serde_json::from_str(value_json)
            .map_err(|e| {
                vec![crate::schema::ValidationError::new(
                    vec![],
                    "parse_error",
                    format!("Invalid value JSON: {}", e),
                )]
            })?;

        // Parse path
        let path: Vec<String> = serde_json::from_str(path_json)
            .map_err(|e| {
                vec![crate::schema::ValidationError::new(
                    vec![],
                    "parse_error",
                    format!("Invalid path JSON: {}", e),
                )]
            })?;

        // Validate at path
        Validator::validate_at_path(&schema, &value, &path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wasm_validate_success() {
        let schema = r#"{"type":"string","min":3}"#;
        let value = r#""hello""#;
        
        let result = WasmValidator::validate(schema, value);
        let parsed: serde_json::Value = serde_json::from_str(&result).unwrap();
        
        assert_eq!(parsed["success"], true);
    }

    #[test]
    fn test_wasm_validate_failure() {
        let schema = r#"{"type":"string","min":5}"#;
        let value = r#""hi""#;
        
        let result = WasmValidator::validate(schema, value);
        let parsed: serde_json::Value = serde_json::from_str(&result).unwrap();
        
        assert_eq!(parsed["success"], false);
        assert!(parsed["errors"].is_array());
    }

    #[test]
    fn test_wasm_validate_at_path() {
        let schema = r#"{"type":"object","shape":{"email":{"type":"string","email":true}}}"#;
        let value = r#"{"email":"test@example.com"}"#;
        let path = r#"["email"]"#;
        
        let result = WasmValidator::validate_at_path(schema, value, path);
        let parsed: serde_json::Value = serde_json::from_str(&result).unwrap();
        
        assert_eq!(parsed["success"], true);
    }
}
