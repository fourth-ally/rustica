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
var wasmInitPromise = null;
/**
 * Initialize WASM module
 * Can be called explicitly for eager loading, or will auto-initialize on first use
 */
function initWasm() {
    return __awaiter(this, void 0, Promise, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (wasmModule)
                return [2 /*return*/];
            if (wasmInitPromise)
                return [2 /*return*/, wasmInitPromise];
            wasmInitPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                var module, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return require("../../pkg/rustica.js"); })];
                        case 1:
                            module = (_a.sent());
                            if (!(typeof module["default"] === "function")) return [3 /*break*/, 3];
                            return [4 /*yield*/, module["default"]()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            wasmModule = module;
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            wasmInitPromise = null; // Reset on error so it can be retried
                            throw new Error("Failed to load WASM module. Make sure to run 'npm run build:wasm' first. Error: " + error_1);
                        case 5: return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/, wasmInitPromise];
        });
    });
}
exports.initWasm = initWasm;
/**
 * Get initialized WASM module (auto-initializes if needed)
 */
function getWasm() {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!wasmModule) return [3 /*break*/, 2];
                    return [4 /*yield*/, initWasm()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, wasmModule];
            }
        });
    });
}
/**
 * Core validator using WASM
 */
var Validator = /** @class */ (function () {
    function Validator() {
    }
    /**
     * Validate data against a schema
     * Auto-initializes WASM on first use
     *
     * @param schema - Schema definition (builder or JSON)
     * @param value - Data to validate
     * @returns Validation result with errors if any
     */
    Validator.validate = function (schema, value) {
        return __awaiter(this, void 0, Promise, function () {
            var wasm, schemaJson, valueJson, resultJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getWasm()];
                    case 1:
                        wasm = _a.sent();
                        schemaJson = JSON.stringify(schema instanceof Object && "toJSON" in schema ? schema.toJSON() : schema);
                        valueJson = JSON.stringify(value);
                        resultJson = wasm.WasmValidator.validate(schemaJson, valueJson);
                        // Parse result
                        return [2 /*return*/, JSON.parse(resultJson)];
                }
            });
        });
    };
    /**
     * Validate data at a specific path in the schema
     * Useful for field-level validation in forms
     * Auto-initializes WASM on first use
     *
     * @param schema - Schema definition
     * @param value - Complete data object
     * @param path - Path to validate (e.g., ['user', 'email'])
     * @returns Validation result for the specific field
     */
    Validator.validateAtPath = function (schema, value, path) {
        return __awaiter(this, void 0, Promise, function () {
            var wasm, schemaJson, valueJson, pathJson, resultJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getWasm()];
                    case 1:
                        wasm = _a.sent();
                        schemaJson = JSON.stringify(schema instanceof Object && "toJSON" in schema ? schema.toJSON() : schema);
                        valueJson = JSON.stringify(value);
                        pathJson = JSON.stringify(path);
                        resultJson = wasm.WasmValidator.validate_at_path(schemaJson, valueJson, pathJson);
                        // Parse result
                        return [2 /*return*/, JSON.parse(resultJson)];
                }
            });
        });
    };
    /**
     * Validate and throw on error (for convenience)
     * Auto-initializes WASM on first use
     */
    Validator.parse = function (schema, value) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validate(schema, value)];
                    case 1:
                        result = _a.sent();
                        if (!result.success) {
                            throw new ValidationException(result.errors || []);
                        }
                        return [2 /*return*/, value];
                }
            });
        });
    };
    /**
     * Safe parse that returns result object
     * Auto-initializes WASM on first use
     */
    Validator.safeParse = function (schema, value) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validate(schema, value)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            return [2 /*return*/, { success: true, data: value }];
                        }
                        else {
                            return [2 /*return*/, { success: false, errors: result.errors || [] }];
                        }
                        return [2 /*return*/];
                }
            });
        });
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
