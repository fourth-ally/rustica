use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Schema AST representing validation rules
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Schema {
    String {
        #[serde(skip_serializing_if = "Option::is_none")]
        min: Option<usize>,
        #[serde(skip_serializing_if = "Option::is_none")]
        max: Option<usize>,
        #[serde(skip_serializing_if = "Option::is_none")]
        email: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        url: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        pattern: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        ui: Option<UiConfig>,
        #[serde(skip_serializing_if = "Option::is_none")]
        messages: Option<StringMessages>,
    },
    Number {
        #[serde(skip_serializing_if = "Option::is_none")]
        min: Option<f64>,
        #[serde(skip_serializing_if = "Option::is_none")]
        max: Option<f64>,
        #[serde(skip_serializing_if = "Option::is_none")]
        integer: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        positive: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        ui: Option<UiConfig>,
        #[serde(skip_serializing_if = "Option::is_none")]
        messages: Option<NumberMessages>,
    },
    Boolean {
        #[serde(skip_serializing_if = "Option::is_none")]
        ui: Option<UiConfig>,
        #[serde(skip_serializing_if = "Option::is_none")]
        messages: Option<BooleanMessages>,
    },
    Object {
        shape: HashMap<String, Schema>,
        #[serde(skip_serializing_if = "Option::is_none")]
        ui: Option<UiConfig>,
        #[serde(skip_serializing_if = "Option::is_none")]
        messages: Option<ObjectMessages>,
    },
}

/// Custom error messages for string validation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StringMessages {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invalid_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pattern: Option<String>,
}

/// Custom error messages for number validation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NumberMessages {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invalid_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub integer: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub positive: Option<String>,
}

/// Custom error messages for boolean validation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BooleanMessages {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invalid_type: Option<String>,
}

/// Custom error messages for object validation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ObjectMessages {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invalid_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub required: Option<String>,
}

/// UI configuration for forms
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UiConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub placeholder: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

/// Validation error with Zod-like structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationError {
    pub path: Vec<String>,
    pub code: String,
    pub message: String,
}

impl ValidationError {
    pub fn new(path: Vec<String>, code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            path,
            code: code.into(),
            message: message.into(),
        }
    }
}

/// Validation result
pub type ValidationResult = Result<(), Vec<ValidationError>>;
