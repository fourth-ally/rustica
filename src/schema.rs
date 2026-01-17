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
    },
    Boolean {
        #[serde(skip_serializing_if = "Option::is_none")]
        ui: Option<UiConfig>,
    },
    Object {
        shape: HashMap<String, Schema>,
        #[serde(skip_serializing_if = "Option::is_none")]
        ui: Option<UiConfig>,
    },
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
