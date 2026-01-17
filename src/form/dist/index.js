"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createForm = void 0;
var validator_1 = require("../validator");
/**
 * Create a form instance with validation
 *
 * This is the core form runtime that manages:
 * - Form values
 * - Touch state
 * - Validation errors
 * - Submit handling
 */
function createForm(config) {
    var schema = config.schema, defaultValues = config.defaultValues, onSubmit = config.onSubmit, _a = config.validateOnBlur, validateOnBlur = _a === void 0 ? true : _a, _b = config.validateOnChange, validateOnChange = _b === void 0 ? false : _b;
    // Internal state
    var state = {
        values: __assign({}, defaultValues),
        touched: Object.keys(defaultValues).reduce(function (acc, key) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[key] = false, _a)));
        }, {}),
        errors: Object.keys(defaultValues).reduce(function (acc, key) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[key] = null, _a)));
        }, {}),
        isSubmitting: false,
        isValid: true
    };
    // Subscribers for reactive updates
    var listeners = new Set();
    /**
     * Notify all subscribers of state change
     */
    function notify() {
        listeners.forEach(function (listener) { return listener(state); });
    }
    /**
     * Update isValid flag based on errors
     */
    function updateValidity() {
        state.isValid = Object.values(state.errors).every(function (error) { return error === null; });
    }
    /**
     * Validate a single field
     */
    function validateField(field) {
        return __awaiter(this, void 0, Promise, function () {
            var path, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = [String(field)];
                        return [4 /*yield*/, validator_1.Validator.validateAtPath(schema, state.values, path)];
                    case 1:
                        result = _a.sent();
                        if (!result.success && result.errors && result.errors.length > 0) {
                            // Return the first error for this field
                            return [2 /*return*/, result.errors[0]];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    }
    /**
     * Validate entire form
     */
    function validateForm() {
        return __awaiter(this, void 0, Promise, function () {
            var result, fieldErrors, key, _i, _a, error, fieldName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, validator_1.Validator.validate(schema, state.values)];
                    case 1:
                        result = _b.sent();
                        fieldErrors = __assign({}, state.errors);
                        // Clear all errors first
                        for (key in fieldErrors) {
                            fieldErrors[key] = null;
                        }
                        // Populate errors from validation result
                        if (!result.success && result.errors) {
                            for (_i = 0, _a = result.errors; _i < _a.length; _i++) {
                                error = _a[_i];
                                if (error.path.length > 0) {
                                    fieldName = error.path[0];
                                    if (fieldName in fieldErrors) {
                                        fieldErrors[fieldName] = error;
                                    }
                                }
                            }
                        }
                        return [2 /*return*/, fieldErrors];
                }
            });
        });
    }
    /**
     * Set field value
     */
    function setValue(field, value) {
        state.values[field] = value;
        if (validateOnChange) {
            validateField(field).then(function (error) {
                state.errors[field] = error;
                updateValidity();
                notify();
            });
        }
        notify();
    }
    /**
     * Set field touched state
     */
    function setTouched(field, touched) {
        state.touched[field] = touched;
        notify();
    }
    /**
     * Handle field blur event
     */
    function handleBlur(field) {
        state.touched[field] = true;
        if (validateOnBlur) {
            validateField(field).then(function (error) {
                state.errors[field] = error;
                updateValidity();
                notify();
            });
        }
        else {
            notify();
        }
    }
    /**
     * Handle field change event
     */
    function handleChange(field, value) {
        setValue(field, value);
    }
    /**
     * Handle form submission
     */
    function handleSubmit(event) {
        return __awaiter(this, void 0, Promise, function () {
            var key, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (event) {
                            event.preventDefault();
                        }
                        // Mark all fields as touched
                        for (key in state.values) {
                            state.touched[key] = true;
                        }
                        // Validate entire form
                        _a = state;
                        return [4 /*yield*/, validateForm()];
                    case 1:
                        // Validate entire form
                        _a.errors = _b.sent();
                        updateValidity();
                        state.isSubmitting = true;
                        notify();
                        if (!state.isValid) return [3 /*break*/, 5];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, onSubmit(state.values)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error("Form submission error:", error_1);
                        return [3 /*break*/, 5];
                    case 5:
                        state.isSubmitting = false;
                        notify();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Reset form to default values
     */
    function reset() {
        state = {
            values: __assign({}, defaultValues),
            touched: Object.keys(defaultValues).reduce(function (acc, key) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[key] = false, _a)));
            }, {}),
            errors: Object.keys(defaultValues).reduce(function (acc, key) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[key] = null, _a)));
            }, {}),
            isSubmitting: false,
            isValid: true
        };
        notify();
    }
    /**
     * Subscribe to form state changes
     */
    function subscribe(listener) {
        listeners.add(listener);
        // Return unsubscribe function
        return function () {
            listeners["delete"](listener);
        };
    }
    // Return form instance
    return {
        get values() {
            return state.values;
        },
        get touched() {
            return state.touched;
        },
        get errors() {
            return state.errors;
        },
        get isSubmitting() {
            return state.isSubmitting;
        },
        get isValid() {
            return state.isValid;
        },
        setValue: setValue,
        setTouched: setTouched,
        validateField: validateField,
        validateForm: validateForm,
        handleBlur: handleBlur,
        handleChange: handleChange,
        handleSubmit: handleSubmit,
        reset: reset,
        subscribe: subscribe
    };
}
exports.createForm = createForm;
