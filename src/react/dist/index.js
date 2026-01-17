"use strict";
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
exports.useFieldHasError = exports.useFieldError = exports.useWasmForm = void 0;
var react_1 = require("react");
var form_1 = require("../form");
/**
 * React hook for WASM-powered form validation
 *
 * Usage:
 * ```tsx
 * const form = useWasmForm({
 *   schema: loginSchema,
 *   defaultValues: { email: '', password: '' },
 *   onSubmit: async (data) => console.log(data)
 * });
 *
 * <form onSubmit={form.handleSubmit}>
 *   <input {...form.register('email')} />
 *   {form.errors.email && <span>{form.errors.email.message}</span>}
 * </form>
 * ```
 */
function useWasmForm(config) {
    var _this = this;
    // Create form instance (only once)
    var formRef = react_1.useRef(form_1.createForm(config));
    var form = formRef.current;
    // Local state for React re-renders
    var _a = react_1.useState({}), forceUpdate = _a[1];
    // Subscribe to form changes on mount
    react_1.useEffect(function () {
        var unsubscribe = form.subscribe(function () {
            forceUpdate({});
        });
        return unsubscribe;
    }, [form]);
    /**
     * Register a field with the form
     * Returns props to spread on input element
     */
    var register = react_1.useCallback(function (name) {
        var _a;
        return {
            name: String(name),
            value: (_a = form.values[name]) !== null && _a !== void 0 ? _a : "",
            onChange: function (event) {
                var value;
                if ("type" in event.target && event.target.type === "checkbox") {
                    value = event.target.checked;
                }
                else if ("type" in event.target && event.target.type === "number") {
                    // Convert to number for number inputs
                    var numValue = event.target.valueAsNumber;
                    value = isNaN(numValue) ? event.target.value : numValue;
                }
                else {
                    value = event.target.value;
                }
                form.handleChange(name, value);
            },
            onBlur: function (event) {
                form.handleBlur(name);
            }
        };
    }, [form]);
    /**
     * Set field value programmatically
     */
    var setValue = react_1.useCallback(function (field, value) {
        form.setValue(field, value);
    }, [form]);
    /**
     * Set field error programmatically
     * Useful for async validation or server-side errors
     */
    var setError = react_1.useCallback(function (field, error) {
        form.errors[field] = error;
        forceUpdate({});
    }, [form]);
    /**
     * Handle form submission
     */
    var handleSubmit = react_1.useCallback(function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, form.handleSubmit(event)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [form]);
    /**
     * Reset form to initial state
     */
    var reset = react_1.useCallback(function () {
        form.reset();
    }, [form]);
    return {
        register: register,
        values: form.values,
        errors: form.errors,
        touched: form.touched,
        isSubmitting: form.isSubmitting,
        isValid: form.isValid,
        setValue: setValue,
        setError: setError,
        handleSubmit: handleSubmit,
        reset: reset
    };
}
exports.useWasmForm = useWasmForm;
/**
 * Hook to get field error message
 * Returns error message if field is touched and has error
 */
function useFieldError(form, field) {
    var error = form.errors[field];
    var touched = form.touched[field];
    if (touched && error) {
        return error.message;
    }
    return null;
}
exports.useFieldError = useFieldError;
/**
 * Hook to check if field has error
 */
function useFieldHasError(form, field) {
    var error = form.errors[field];
    var touched = form.touched[field];
    return touched && error !== null;
}
exports.useFieldHasError = useFieldHasError;
