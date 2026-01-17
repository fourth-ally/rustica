"use strict";
/**
 * Rustica
 * Production-grade schema and form validation powered by Rust and WebAssembly
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
// Schema builder API
var schema_1 = require("./schema");
__createBinding(exports, schema_1, "r");
__createBinding(exports, schema_1, "type");
__createBinding(exports, schema_1, "type");
var builders_1 = require("./schema/builders");
__createBinding(exports, builders_1, "ZString");
__createBinding(exports, builders_1, "ZNumber");
__createBinding(exports, builders_1, "ZBoolean");
__createBinding(exports, builders_1, "ZObject");
__createBinding(exports, builders_1, "SchemaBuilder");
// Validator
var validator_1 = require("./validator");
__createBinding(exports, validator_1, "Validator");
__createBinding(exports, validator_1, "ValidationException");
__createBinding(exports, validator_1, "initWasm");
__createBinding(exports, validator_1, "createValidator");
// Form runtime
var form_1 = require("./form");
__createBinding(exports, form_1, "createForm");
__createBinding(exports, form_1, "type");
__createBinding(exports, form_1, "type");
__createBinding(exports, form_1, "type");
__createBinding(exports, form_1, "type");
// React hooks (optional peer dependency)
var react_1 = require("./react");
__createBinding(exports, react_1, "useWasmForm");
__createBinding(exports, react_1, "useFieldError");
__createBinding(exports, react_1, "useFieldHasError");
__createBinding(exports, react_1, "type");
__createBinding(exports, react_1, "UseWasmFormReturn");
__createBinding(exports, react_1, "type");
__createBinding(exports, react_1, "FieldRegistration");
