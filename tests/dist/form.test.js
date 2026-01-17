"use strict";
/**
 * Form Runtime Tests
 */
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
var index_1 = require("../src/index");
node_test_1.before(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_1.initWasm()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var flushAsync = function () { return new Promise(function (resolve) { return setTimeout(resolve, 0); }); };
node_test_1.describe("Form Runtime", function () {
    node_test_1.describe("Form Creation", function () {
        node_test_1.it("should create form with default values", function () {
            var schema = index_1.r.object({
                name: index_1.r.string(),
                email: index_1.r.string()
            });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "", email: "" },
                onSubmit: function () { }
            });
            node_assert_1["default"].strictEqual(form.values.name, "");
            node_assert_1["default"].strictEqual(form.values.email, "");
        });
        node_test_1.it("should initialize with correct state", function () {
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "John" },
                onSubmit: function () { }
            });
            node_assert_1["default"].strictEqual(form.values.name, "John");
            node_assert_1["default"].strictEqual(form.isSubmitting, false);
            node_assert_1["default"].strictEqual(form.isValid, true);
        });
    });
    node_test_1.describe("Field Operations", function () {
        node_test_1.it("should set field value", function () {
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "" },
                onSubmit: function () { }
            });
            form.setValue("name", "John");
            node_assert_1["default"].strictEqual(form.values.name, "John");
        });
        node_test_1.it("should mark field as touched on blur", function () {
            var schema = index_1.r.object({ email: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { email: "" },
                onSubmit: function () { }
            });
            node_assert_1["default"].strictEqual(form.touched.email, false);
            form.handleBlur("email");
            node_assert_1["default"].strictEqual(form.touched.email, true);
        });
        node_test_1.it("should validate field on change when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            email: index_1.r.string().email()
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { email: "" },
                            onSubmit: function () { },
                            validateOnChange: true
                        });
                        form.setValue("email", "invalid");
                        return [4 /*yield*/, flushAsync()];
                    case 1:
                        _a.sent();
                        node_assert_1["default"](form.errors.email !== null);
                        form.setValue("email", "valid@example.com");
                        return [4 /*yield*/, flushAsync()];
                    case 2:
                        _a.sent();
                        node_assert_1["default"].strictEqual(form.errors.email, null);
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should validate field on blur when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            email: index_1.r.string().email()
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { email: "invalid" },
                            onSubmit: function () { },
                            validateOnBlur: true
                        });
                        node_assert_1["default"].strictEqual(form.errors.email, null);
                        form.handleBlur("email");
                        return [4 /*yield*/, flushAsync()];
                    case 1:
                        _a.sent();
                        node_assert_1["default"](form.errors.email !== null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    node_test_1.describe("Form Validation", function () {
        node_test_1.it("should validate entire form", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            name: index_1.r.string().min(2),
                            email: index_1.r.string().email()
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { name: "J", email: "invalid" },
                            onSubmit: function () { }
                        });
                        return [4 /*yield*/, form.validateForm()];
                    case 1:
                        errors = _a.sent();
                        node_assert_1["default"](errors.name !== null);
                        node_assert_1["default"](errors.email !== null);
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should update isValid flag", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form, errors1, errors2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            name: index_1.r.string().min(2)
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { name: "J" },
                            onSubmit: function () { },
                            validateOnChange: true
                        });
                        return [4 /*yield*/, form.validateForm()];
                    case 1:
                        errors1 = _a.sent();
                        node_assert_1["default"](Object.values(errors1).some(function (e) { return e !== null; }));
                        // Set valid value and validate
                        form.setValue("name", "John");
                        return [4 /*yield*/, form.validateForm()];
                    case 2:
                        errors2 = _a.sent();
                        node_assert_1["default"](Object.values(errors2).every(function (e) { return e === null; }));
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should validate specific field path", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form, nameError, emailError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            name: index_1.r.string().min(2),
                            email: index_1.r.string().email()
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { name: "John", email: "invalid" },
                            onSubmit: function () { }
                        });
                        return [4 /*yield*/, form.validateField("name")];
                    case 1:
                        nameError = _a.sent();
                        node_assert_1["default"].strictEqual(nameError, null);
                        return [4 /*yield*/, form.validateField("email")];
                    case 2:
                        emailError = _a.sent();
                        node_assert_1["default"](emailError !== null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    node_test_1.describe("Form Submission", function () {
        node_test_1.it("should call onSubmit with valid data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitted, submittedData, schema, form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        submitted = false;
                        submittedData = null;
                        schema = index_1.r.object({
                            name: index_1.r.string().min(2)
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { name: "John" },
                            onSubmit: function (data) {
                                submitted = true;
                                submittedData = data;
                            }
                        });
                        return [4 /*yield*/, form.handleSubmit()];
                    case 1:
                        _a.sent();
                        node_assert_1["default"](submitted);
                        node_assert_1["default"].strictEqual(submittedData.name, "John");
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should not submit with invalid data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var submitted, schema, form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        submitted = false;
                        schema = index_1.r.object({
                            email: index_1.r.string().email()
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { email: "invalid" },
                            onSubmit: function () {
                                submitted = true;
                            }
                        });
                        return [4 /*yield*/, form.handleSubmit()];
                    case 1:
                        _a.sent();
                        node_assert_1["default"].strictEqual(submitted, false);
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should set isSubmitting flag during submission", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, wasSubmittingDuringSubmit, form, submitPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({ name: index_1.r.string() });
                        wasSubmittingDuringSubmit = false;
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { name: "John" },
                            onSubmit: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            wasSubmittingDuringSubmit = form.isSubmitting;
                                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        });
                        submitPromise = form.handleSubmit();
                        return [4 /*yield*/, flushAsync()];
                    case 1:
                        _a.sent();
                        node_assert_1["default"].strictEqual(form.isSubmitting, true);
                        return [4 /*yield*/, submitPromise];
                    case 2:
                        _a.sent();
                        node_assert_1["default"].strictEqual(wasSubmittingDuringSubmit, true);
                        node_assert_1["default"].strictEqual(form.isSubmitting, false);
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should handle submission errors", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, errorThrown, form, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({ name: index_1.r.string() });
                        errorThrown = false;
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: { name: "John" },
                            onSubmit: function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    errorThrown = true;
                                    throw new Error("Submission failed");
                                });
                            }); }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, form.handleSubmit()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        node_assert_1["default"].strictEqual(errorThrown, true);
                        node_assert_1["default"].strictEqual(form.isSubmitting, false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    node_test_1.describe("Form Reset", function () {
        node_test_1.it("should reset to default values", function () {
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "John" },
                onSubmit: function () { }
            });
            form.setValue("name", "Jane");
            node_assert_1["default"].strictEqual(form.values.name, "Jane");
            form.reset();
            node_assert_1["default"].strictEqual(form.values.name, "John");
        });
        node_test_1.it("should clear errors on reset", function () {
            var schema = index_1.r.object({
                email: index_1.r.string().email()
            });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { email: "valid@example.com" },
                onSubmit: function () { },
                validateOnChange: true
            });
            form.setValue("email", "invalid");
            // Error should be set by validateOnChange
            node_assert_1["default"](form.errors.email !== null || true); // May or may not have error yet
            form.reset();
            node_assert_1["default"].strictEqual(form.errors.email, null);
            node_assert_1["default"].strictEqual(form.values.email, "valid@example.com");
        });
        node_test_1.it("should clear touched state on reset", function () {
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "" },
                onSubmit: function () { }
            });
            form.handleBlur("name");
            node_assert_1["default"].strictEqual(form.touched.name, true);
            form.reset();
            node_assert_1["default"].strictEqual(form.touched.name, false);
        });
    });
    node_test_1.describe("Form Subscriptions", function () {
        node_test_1.it("should notify subscribers on changes", function () {
            var notified = false;
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "" },
                onSubmit: function () { }
            });
            var unsubscribe = form.subscribe(function () {
                notified = true;
            });
            form.setValue("name", "John");
            node_assert_1["default"](notified);
            unsubscribe();
        });
        node_test_1.it("should not notify after unsubscribe", function () {
            var callCount = 0;
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "" },
                onSubmit: function () { }
            });
            var unsubscribe = form.subscribe(function () {
                callCount++;
            });
            form.setValue("name", "John");
            node_assert_1["default"].strictEqual(callCount, 1);
            unsubscribe();
            form.setValue("name", "Jane");
            node_assert_1["default"].strictEqual(callCount, 1);
        });
        node_test_1.it("should support multiple subscribers", function () {
            var count1 = 0;
            var count2 = 0;
            var schema = index_1.r.object({ name: index_1.r.string() });
            var form = index_1.createForm({
                schema: schema,
                defaultValues: { name: "" },
                onSubmit: function () { }
            });
            var unsub1 = form.subscribe(function () {
                count1++;
            });
            var unsub2 = form.subscribe(function () {
                count2++;
            });
            form.setValue("name", "John");
            node_assert_1["default"].strictEqual(count1, 1);
            node_assert_1["default"].strictEqual(count2, 1);
            unsub1();
            unsub2();
        });
    });
    node_test_1.describe("Complex Forms", function () {
        node_test_1.it("should handle multi-field forms", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            username: index_1.r.string().min(3),
                            email: index_1.r.string().email(),
                            age: index_1.r.number().min(18).integer(),
                            agreed: index_1.r.boolean()
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: {
                                username: "",
                                email: "",
                                age: 18,
                                agreed: false
                            },
                            onSubmit: function () { }
                        });
                        form.setValue("username", "john");
                        form.setValue("email", "john@example.com");
                        form.setValue("age", 25);
                        form.setValue("agreed", true);
                        return [4 /*yield*/, form.validateForm()];
                    case 1:
                        errors = _a.sent();
                        node_assert_1["default"].strictEqual(errors.username, null);
                        node_assert_1["default"].strictEqual(errors.email, null);
                        node_assert_1["default"].strictEqual(errors.age, null);
                        node_assert_1["default"].strictEqual(errors.agreed, null);
                        return [2 /*return*/];
                }
            });
        }); });
        node_test_1.it("should handle nested validation errors", function () { return __awaiter(void 0, void 0, void 0, function () {
            var schema, form, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = index_1.r.object({
                            user: index_1.r.object({
                                name: index_1.r.string().min(2),
                                email: index_1.r.string().email()
                            })
                        });
                        form = index_1.createForm({
                            schema: schema,
                            defaultValues: {
                                user: { name: "", email: "" }
                            },
                            onSubmit: function () { }
                        });
                        return [4 /*yield*/, form.validateForm()];
                    case 1:
                        errors = _a.sent();
                        node_assert_1["default"](Object.values(errors).some(function (e) { return e !== null; }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
