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
var node_test_1 = require("node:test");
var node_assert_1 = require("node:assert");
var src_1 = require("../src");
node_test_1.describe("Custom Error Messages", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Initialize WASM before running tests
            return [4 /*yield*/, src_1.initWasm()];
            case 1:
                // Initialize WASM before running tests
                _a.sent();
                node_test_1.describe("String validation messages", function () {
                    node_test_1.it("should use custom invalid_type message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().messages({
                                        invalid_type: "Please provide text, not a number"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, 123)];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Please provide text, not a number");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "invalid_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom min length message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().min(5).messages({
                                        min: "Username must be at least 5 characters long"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "abc")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Username must be at least 5 characters long");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "string.min");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom max length message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().max(10).messages({
                                        max: "Username cannot exceed 10 characters"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "verylongusername")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Username cannot exceed 10 characters");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "string.max");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom email message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().email().messages({
                                        email: "Please enter a valid email address like user@example.com"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "notanemail")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Please enter a valid email address like user@example.com");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "string.email");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom URL message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().url().messages({
                                        url: "Please provide a valid URL starting with http:// or https://"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "notaurl")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Please provide a valid URL starting with http:// or https://");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "string.url");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom pattern message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().pattern("test").messages({
                                        pattern: 'String must contain the word "test"'
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "hello world")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, 'String must contain the word "test"');
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "string.pattern");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use default messages when custom messages not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    schema = src_1.r.string().min(5);
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "abc")];
                                case 1:
                                    result = _b.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "String must be at least 5 characters");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                node_test_1.describe("Number validation messages", function () {
                    node_test_1.it("should use custom invalid_type message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.number().messages({
                                        invalid_type: "Age must be a number"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "twenty")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Age must be a number");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "invalid_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom min value message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.number().min(18).messages({
                                        min: "You must be at least 18 years old"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, 16)];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "You must be at least 18 years old");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "number.min");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom max value message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.number().max(100).messages({
                                        max: "Age cannot exceed 100"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, 150)];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Age cannot exceed 100");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "number.max");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom integer message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.number().integer().messages({
                                        integer: "Quantity must be a whole number"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, 3.14)];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Quantity must be a whole number");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "number.integer");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom positive message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.number().positive().messages({
                                        positive: "Price must be greater than zero"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, -10)];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Price must be greater than zero");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "number.positive");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use default messages when custom messages not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    schema = src_1.r.number().min(0);
                                    return [4 /*yield*/, src_1.Validator.validate(schema, -5)];
                                case 1:
                                    result = _b.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Number must be at least 0");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                node_test_1.describe("Boolean validation messages", function () {
                    node_test_1.it("should use custom invalid_type message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.boolean().messages({
                                        invalid_type: "Please select yes or no"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "maybe")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Please select yes or no");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "invalid_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use default message when custom message not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    schema = src_1.r.boolean();
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "yes")];
                                case 1:
                                    result = _b.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Expected boolean");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                node_test_1.describe("Object validation messages", function () {
                    node_test_1.it("should use custom invalid_type message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r
                                        .object({
                                        name: src_1.r.string()
                                    })
                                        .messages({
                                        invalid_type: "User data must be an object"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "not an object")];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "User data must be an object");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "invalid_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use custom required field message", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r
                                        .object({
                                        email: src_1.r.string()
                                    })
                                        .messages({
                                        required: "This field is mandatory"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, {})];
                                case 1:
                                    result = _c.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "This field is mandatory");
                                    node_assert_1["default"].strictEqual((_b = result.errors) === null || _b === void 0 ? void 0 : _b[0].code, "required");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should use default message when custom message not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    schema = src_1.r.object({
                                        email: src_1.r.string()
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, {})];
                                case 1:
                                    result = _b.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Field 'email' is required");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should support custom messages on nested fields", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result, emailError, ageError;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    schema = src_1.r.object({
                                        email: src_1.r.string().email().messages({
                                            email: "Invalid email format for user registration"
                                        }),
                                        age: src_1.r.number().min(18).messages({
                                            min: "You must be 18 or older to register"
                                        })
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, {
                                            email: "bademail",
                                            age: 16
                                        })];
                                case 1:
                                    result = _d.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].strictEqual((_a = result.errors) === null || _a === void 0 ? void 0 : _a.length, 2);
                                    emailError = (_b = result.errors) === null || _b === void 0 ? void 0 : _b.find(function (e) { return e.path.includes("email"); });
                                    node_assert_1["default"].strictEqual(emailError === null || emailError === void 0 ? void 0 : emailError.message, "Invalid email format for user registration");
                                    ageError = (_c = result.errors) === null || _c === void 0 ? void 0 : _c.find(function (e) { return e.path.includes("age"); });
                                    node_assert_1["default"].strictEqual(ageError === null || ageError === void 0 ? void 0 : ageError.message, "You must be 18 or older to register");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                node_test_1.describe("Mixed validation with custom messages", function () {
                    node_test_1.it("should handle complex form with multiple custom messages", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var registrationSchema, result, usernameError, emailError, ageErrors;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    registrationSchema = src_1.r.object({
                                        username: src_1.r.string().min(3).max(20).messages({
                                            invalid_type: "Username must be text",
                                            min: "Username too short - minimum 3 characters",
                                            max: "Username too long - maximum 20 characters"
                                        }),
                                        email: src_1.r.string().email().messages({
                                            invalid_type: "Email must be text",
                                            email: "Please enter a valid email address"
                                        }),
                                        age: src_1.r.number().min(13).max(120).integer().messages({
                                            invalid_type: "Age must be a number",
                                            min: "You must be at least 13 years old",
                                            max: "Please enter a realistic age",
                                            integer: "Age must be a whole number"
                                        }),
                                        website: src_1.r.string().url().messages({
                                            url: "Website must start with http:// or https://"
                                        }),
                                        agreed: src_1.r.boolean().messages({
                                            invalid_type: "You must accept the terms"
                                        })
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(registrationSchema, {
                                            username: "ab",
                                            email: "notanemail",
                                            age: 12.5,
                                            website: "badurl",
                                            agreed: "yes"
                                        })];
                                case 1:
                                    result = _d.sent();
                                    node_assert_1["default"].strictEqual(result.success, false);
                                    node_assert_1["default"].ok(result.errors);
                                    node_assert_1["default"].ok(result.errors.length > 0);
                                    usernameError = (_a = result.errors) === null || _a === void 0 ? void 0 : _a.find(function (e) {
                                        return e.path.includes("username");
                                    });
                                    node_assert_1["default"].strictEqual(usernameError === null || usernameError === void 0 ? void 0 : usernameError.message, "Username too short - minimum 3 characters");
                                    emailError = (_b = result.errors) === null || _b === void 0 ? void 0 : _b.find(function (e) { return e.path.includes("email"); });
                                    node_assert_1["default"].strictEqual(emailError === null || emailError === void 0 ? void 0 : emailError.message, "Please enter a valid email address");
                                    ageErrors = (_c = result.errors) === null || _c === void 0 ? void 0 : _c.filter(function (e) { return e.path.includes("age"); });
                                    node_assert_1["default"].ok(ageErrors === null || ageErrors === void 0 ? void 0 : ageErrors.some(function (e) { return e.message.includes("13 years old"); }));
                                    node_assert_1["default"].ok(ageErrors === null || ageErrors === void 0 ? void 0 : ageErrors.some(function (e) { return e.message.includes("whole number"); }));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    node_test_1.it("should pass validation when all values are correct", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    schema = src_1.r.object({
                                        username: src_1.r.string().min(3).messages({
                                            min: "Username too short"
                                        }),
                                        age: src_1.r.number().min(18).messages({
                                            min: "Must be 18+"
                                        })
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, {
                                            username: "validuser",
                                            age: 25
                                        })];
                                case 1:
                                    result = _a.sent();
                                    node_assert_1["default"].strictEqual(result.success, true);
                                    node_assert_1["default"].strictEqual(result.errors, undefined);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                node_test_1.describe("Partial custom messages", function () {
                    node_test_1.it("should use custom message for some validations and defaults for others", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var schema, resultMin, resultMax;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    schema = src_1.r.string().min(5).max(10).email().messages({
                                        min: "Too short!"
                                    });
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "abc")];
                                case 1:
                                    resultMin = _c.sent();
                                    node_assert_1["default"].strictEqual(resultMin.success, false);
                                    node_assert_1["default"].strictEqual((_a = resultMin.errors) === null || _a === void 0 ? void 0 : _a[0].message, "Too short!");
                                    return [4 /*yield*/, src_1.Validator.validate(schema, "verylongemailaddress")];
                                case 2:
                                    resultMax = _c.sent();
                                    node_assert_1["default"].strictEqual(resultMax.success, false);
                                    node_assert_1["default"].strictEqual((_b = resultMax.errors) === null || _b === void 0 ? void 0 : _b[0].message, "String must be at most 10 characters");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); });
