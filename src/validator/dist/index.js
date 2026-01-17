"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createValidator = exports.ValidationException = exports.Validator = exports.initWasm = void 0;
/**
 * Lazy-loaded WASM module singleton
 */
var wasmModule = null;
/**
 * Initialize WASM module
 * Must be called before validation
 */
function initWasm() {
    return __awaiter(this, void 0, Promise, function () {
        var module, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (wasmModule)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../pkg/rustica.js"); })];
                case 2:
                    module = (_a.sent());
                    if (!(typeof module["default"] === "function")) return [3 /*break*/, 4];
                    return [4 /*yield*/, module["default"]()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    wasmModule = module;
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    throw new Error("Failed to load WASM module. Make sure to run 'npm run build:wasm' first. Error: " + error_1);
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.initWasm = initWasm;
/**
 * Get initialized WASM module
 */
function getWasm() {
    if (!wasmModule) {
        throw new Error("WASM module not initialized. Call initWasm() before validation.");
    }
    return wasmModule;
}
/**
 * Core validator using WASM
 */
var Validator = /** @class */ (function () {
    function Validator() {
    }
    /**
     * Validate data against a schema
     *
     * @param schema - Schema definition (builder or JSON)
     * @param value - Data to validate
     * @returns Validation result with errors if any
     */
    Validator.validate = function (schema, value) {
        var wasm = getWasm();
        // Serialize schema to JSON
        var schemaJson = JSON.stringify(schema instanceof Object && "toJSON" in schema ? schema.toJSON() : schema);
        // Serialize value to JSON
        var valueJson = JSON.stringify(value);
        // Call WASM validator (single call, zero-copy)
        var resultJson = wasm.WasmValidator.validate(schemaJson, valueJson);
        // Parse result
        return JSON.parse(resultJson);
    };
    /**
     * Validate data at a specific path in the schema
     * Useful for field-level validation in forms
     *
     * @param schema - Schema definition
     * @param value - Complete data object
     * @param path - Path to validate (e.g., ['user', 'email'])
     * @returns Validation result for the specific field
     */
    Validator.validateAtPath = function (schema, value, path) {
        var wasm = getWasm();
        // Serialize inputs
        var schemaJson = JSON.stringify(schema instanceof Object && "toJSON" in schema ? schema.toJSON() : schema);
        var valueJson = JSON.stringify(value);
        var pathJson = JSON.stringify(path);
        // Call WASM validator (single call)
        var resultJson = wasm.WasmValidator.validate_at_path(schemaJson, valueJson, pathJson);
        // Parse result
        return JSON.parse(resultJson);
    };
    /**
     * Validate and throw on error (for convenience)
     */
    Validator.parse = function (schema, value) {
        var result = this.validate(schema, value);
        if (!result.success) {
            throw new ValidationException(result.errors || []);
        }
        return value;
    };
    /**
     * Safe parse that returns result object
     */
    Validator.safeParse = function (schema, value) {
        var result = this.validate(schema, value);
        if (result.success) {
            return { success: true, data: value };
        }
        else {
            return { success: false, errors: result.errors || [] };
        }
    };
    return Validator;
}());
exports.Validator = Validator;
/**
 * Validation exception for parse() method
 */
var ValidationException = /** @class */ (function (_super) {
    __extends(ValidationException, _super);
    function ValidationException(errors) {
        var _this = _super.call(this, "Validation failed:\n" +
            errors.map(function (e) { return "  - " + e.path.join(".") + ": " + e.message; }).join("\n")) || this;
        _this.errors = errors;
        _this.name = "ValidationException";
        return _this;
    }
    return ValidationException;
}(Error));
exports.ValidationException = ValidationException;
/**
 * Auto-initialization wrapper
 * Automatically initializes WASM on first use
 */
function createValidator() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initWasm()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, Validator];
            }
        });
    });
}
exports.createValidator = createValidator;
