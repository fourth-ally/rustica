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
exports.RegistrationFormExample = exports.LoginFormExample = void 0;
var react_1 = require("react");
var index_1 = require("../src/index");
// Initialize WASM before using forms
await index_1.initWasm();
/**
 * Example: Login form schema with validation
 */
var loginSchema = index_1.r.object({
    email: index_1.r.string().min(3).email().ui({
        label: "Email Address",
        placeholder: "you@example.com"
    }),
    password: index_1.r.string().min(8).ui({
        label: "Password",
        placeholder: "Min 8 characters"
    }),
    remember: index_1.r.boolean().ui({ label: "Remember me" })
});
/**
 * Login form component using useWasmForm hook
 */
function LoginFormExample() {
    var _this = this;
    var form = index_1.useWasmForm({
        schema: loginSchema,
        defaultValues: {
            email: "",
            password: "",
            remember: false
        },
        onSubmit: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Form submitted with valid data:", data);
                        // Simulate API call
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        // Simulate API call
                        _a.sent();
                        alert("Login successful!");
                        return [2 /*return*/];
                }
            });
        }); },
        validateOnBlur: true
    });
    return (react_1["default"].createElement("div", { style: { maxWidth: "400px", margin: "50px auto", padding: "20px" } },
        react_1["default"].createElement("h2", null, "Login Form Example"),
        react_1["default"].createElement("form", { onSubmit: form.handleSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" } },
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                react_1["default"].createElement("label", { htmlFor: "email", style: { fontWeight: "bold" } }, "Email Address"),
                react_1["default"].createElement("input", __assign({ id: "email", type: "email", placeholder: "you@example.com" }, form.register("email"), { style: {
                        padding: "8px",
                        border: form.errors.email ? "2px solid red" : "1px solid #ccc",
                        borderRadius: "4px"
                    } })),
                form.touched.email && form.errors.email && (react_1["default"].createElement("span", { style: { color: "red", fontSize: "14px" } }, form.errors.email.message))),
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                react_1["default"].createElement("label", { htmlFor: "password", style: { fontWeight: "bold" } }, "Password"),
                react_1["default"].createElement("input", __assign({ id: "password", type: "password", placeholder: "Min 8 characters" }, form.register("password"), { style: {
                        padding: "8px",
                        border: form.errors.password ? "2px solid red" : "1px solid #ccc",
                        borderRadius: "4px"
                    } })),
                form.touched.password && form.errors.password && (react_1["default"].createElement("span", { style: { color: "red", fontSize: "14px" } }, form.errors.password.message))),
            react_1["default"].createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
                react_1["default"].createElement("input", __assign({ id: "remember", type: "checkbox" }, form.register("remember"))),
                react_1["default"].createElement("label", { htmlFor: "remember" }, "Remember me")),
            react_1["default"].createElement("button", { type: "submit", disabled: form.isSubmitting, style: {
                    padding: "12px",
                    backgroundColor: form.isSubmitting ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: form.isSubmitting ? "not-allowed" : "pointer",
                    fontWeight: "bold"
                } }, form.isSubmitting ? "Submitting..." : "Login"),
            react_1["default"].createElement("button", { type: "button", onClick: form.reset, style: {
                    padding: "12px",
                    backgroundColor: "transparent",
                    color: "#007bff",
                    border: "1px solid #007bff",
                    borderRadius: "4px",
                    cursor: "pointer"
                } }, "Reset")),
        react_1["default"].createElement("div", { style: {
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px"
            } },
            react_1["default"].createElement("h3", { style: { margin: "0 0 10px 0" } }, "Debug Info"),
            react_1["default"].createElement("pre", { style: { fontSize: "12px", overflow: "auto" } }, JSON.stringify({
                values: form.values,
                errors: form.errors,
                touched: form.touched,
                isValid: form.isValid
            }, null, 2)))));
}
exports.LoginFormExample = LoginFormExample;
/**
 * Example: Registration form with more complex validation
 */
var registrationSchema = index_1.r.object({
    username: index_1.r.string().min(3).max(20).ui({ label: "Username" }),
    email: index_1.r.string().min(3).email().ui({ label: "Email" }),
    age: index_1.r.number().min(18).max(120).integer().ui({ label: "Age" }),
    website: index_1.r
        .string()
        .url()
        .ui({ label: "Website", placeholder: "https://example.com" }),
    agree: index_1.r.boolean().ui({ label: "I agree to terms and conditions" })
});
function RegistrationFormExample() {
    var _this = this;
    var form = index_1.useWasmForm({
        schema: registrationSchema,
        defaultValues: {
            username: "",
            email: "",
            age: 18,
            website: "",
            agree: false
        },
        onSubmit: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Registration data:", data);
                alert("Registration successful!");
                return [2 /*return*/];
            });
        }); }
    });
    return (react_1["default"].createElement("div", { style: { maxWidth: "400px", margin: "50px auto", padding: "20px" } },
        react_1["default"].createElement("h2", null, "Registration Form Example"),
        react_1["default"].createElement("form", { onSubmit: form.handleSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" } },
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                react_1["default"].createElement("label", { htmlFor: "username", style: { fontWeight: "bold" } }, "Username"),
                react_1["default"].createElement("input", __assign({ id: "username" }, form.register("username"), { style: {
                        padding: "8px",
                        border: form.errors.username ? "2px solid red" : "1px solid #ccc",
                        borderRadius: "4px"
                    } })),
                form.touched.username && form.errors.username && (react_1["default"].createElement("span", { style: { color: "red", fontSize: "14px" } }, form.errors.username.message))),
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                react_1["default"].createElement("label", { htmlFor: "email", style: { fontWeight: "bold" } }, "Email"),
                react_1["default"].createElement("input", __assign({ id: "email", type: "email" }, form.register("email"), { style: {
                        padding: "8px",
                        border: form.errors.email ? "2px solid red" : "1px solid #ccc",
                        borderRadius: "4px"
                    } })),
                form.touched.email && form.errors.email && (react_1["default"].createElement("span", { style: { color: "red", fontSize: "14px" } }, form.errors.email.message))),
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                react_1["default"].createElement("label", { htmlFor: "age", style: { fontWeight: "bold" } }, "Age"),
                react_1["default"].createElement("input", __assign({ id: "age", type: "number" }, form.register("age"), { style: {
                        padding: "8px",
                        border: form.errors.age ? "2px solid red" : "1px solid #ccc",
                        borderRadius: "4px"
                    } })),
                form.touched.age && form.errors.age && (react_1["default"].createElement("span", { style: { color: "red", fontSize: "14px" } }, form.errors.age.message))),
            react_1["default"].createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                react_1["default"].createElement("label", { htmlFor: "website", style: { fontWeight: "bold" } }, "Website"),
                react_1["default"].createElement("input", __assign({ id: "website", type: "url", placeholder: "https://example.com" }, form.register("website"), { style: {
                        padding: "8px",
                        border: form.errors.website ? "2px solid red" : "1px solid #ccc",
                        borderRadius: "4px"
                    } })),
                form.touched.website && form.errors.website && (react_1["default"].createElement("span", { style: { color: "red", fontSize: "14px" } }, form.errors.website.message))),
            react_1["default"].createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
                react_1["default"].createElement("input", __assign({ id: "agree", type: "checkbox" }, form.register("agree"))),
                react_1["default"].createElement("label", { htmlFor: "agree" }, "I agree to terms and conditions")),
            react_1["default"].createElement("button", { type: "submit", disabled: form.isSubmitting || !form.values.agree, style: {
                    padding: "12px",
                    backgroundColor: form.isSubmitting || !form.values.agree ? "#ccc" : "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: form.isSubmitting || !form.values.agree
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "bold"
                } }, form.isSubmitting ? "Registering..." : "Register"))));
}
exports.RegistrationFormExample = RegistrationFormExample;
