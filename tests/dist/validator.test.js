"use strict";
/**
 * Comprehensive test suite for Rust-JS Validator
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
// Initialize WASM before all tests
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
node_test_1.describe("Schema Builders", function () {
    node_test_1.test("r.string() creates string schema", function () {
        var schema = index_1.r.string();
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual(json.type, "string");
    });
    node_test_1.test("r.string() with constraints", function () {
        var schema = index_1.r.string().min(3).max(10).email();
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual(json.min, 3);
        node_assert_1["default"].strictEqual(json.max, 10);
        node_assert_1["default"].strictEqual(json.email, true);
    });
    node_test_1.test("r.number() creates number schema", function () {
        var schema = index_1.r.number();
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual(json.type, "number");
    });
    node_test_1.test("r.number() with constraints", function () {
        var schema = index_1.r.number().min(0).max(100).integer();
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual(json.min, 0);
        node_assert_1["default"].strictEqual(json.max, 100);
        node_assert_1["default"].strictEqual(json.integer, true);
    });
    node_test_1.test("r.boolean() creates boolean schema", function () {
        var schema = index_1.r.boolean();
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual(json.type, "boolean");
    });
    node_test_1.test("r.object() creates object schema", function () {
        var schema = index_1.r.object({
            name: index_1.r.string(),
            age: index_1.r.number()
        });
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual(json.type, "object");
        node_assert_1["default"](json.shape.name);
        node_assert_1["default"](json.shape.age);
    });
    node_test_1.test("UI configuration", function () {
        var _a, _b;
        var schema = index_1.r
            .string()
            .ui({ label: "Email", placeholder: "test@example.com" });
        var json = schema.toJSON();
        node_assert_1["default"].strictEqual((_a = json.ui) === null || _a === void 0 ? void 0 : _a.label, "Email");
        node_assert_1["default"].strictEqual((_b = json.ui) === null || _b === void 0 ? void 0 : _b.placeholder, "test@example.com");
    });
});
node_test_1.describe("String Validation", function () {
    node_test_1.test("validates valid string", function () {
        var schema = index_1.r.string();
        var result = index_1.Validator.validate(schema, "hello");
        node_assert_1["default"].strictEqual(result.success, true);
    });
    node_test_1.test("rejects non-string", function () {
        var _a;
        var schema = index_1.r.string();
        var result = index_1.Validator.validate(schema, 123);
        node_assert_1["default"].strictEqual(result.success, false);
        node_assert_1["default"](((_a = result.errors) === null || _a === void 0 ? void 0 : _a[0].code) === "invalid_type");
    });
    node_test_1.test("validates min length", function () {
        var schema = index_1.r.string().min(5);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "hello").success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "hi").success, false);
    });
    node_test_1.test("validates max length", function () {
        var schema = index_1.r.string().max(5);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "hello").success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "toolong").success, false);
    });
    node_test_1.test("validates email", function () {
        var schema = index_1.r.string().email();
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "test@example.com").success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "invalid").success, false);
    });
    node_test_1.test("validates URL", function () {
        var schema = index_1.r.string().url();
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "https://example.com").success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "not-a-url").success, false);
    });
});
node_test_1.describe("Number Validation", function () {
    node_test_1.test("validates valid number", function () {
        var schema = index_1.r.number();
        var result = index_1.Validator.validate(schema, 42);
        node_assert_1["default"].strictEqual(result.success, true);
    });
    node_test_1.test("rejects non-number", function () {
        var schema = index_1.r.number();
        var result = index_1.Validator.validate(schema, "not a number");
        node_assert_1["default"].strictEqual(result.success, false);
    });
    node_test_1.test("validates min value", function () {
        var schema = index_1.r.number().min(10);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 15).success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 5).success, false);
    });
    node_test_1.test("validates max value", function () {
        var schema = index_1.r.number().max(100);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 50).success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 150).success, false);
    });
    node_test_1.test("validates integer", function () {
        var schema = index_1.r.number().integer();
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 42).success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 42.5).success, false);
    });
    node_test_1.test("validates positive", function () {
        var schema = index_1.r.number().positive();
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 5).success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, -5).success, false);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 0).success, false);
    });
});
node_test_1.describe("Boolean Validation", function () {
    node_test_1.test("validates valid boolean", function () {
        var schema = index_1.r.boolean();
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, true).success, true);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, false).success, true);
    });
    node_test_1.test("rejects non-boolean", function () {
        var schema = index_1.r.boolean();
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, "true").success, false);
        node_assert_1["default"].strictEqual(index_1.Validator.validate(schema, 1).success, false);
    });
});
node_test_1.describe("Object Validation", function () {
    node_test_1.test("validates valid object", function () {
        var schema = index_1.r.object({
            name: index_1.r.string(),
            age: index_1.r.number()
        });
        var result = index_1.Validator.validate(schema, { name: "John", age: 30 });
        node_assert_1["default"].strictEqual(result.success, true);
    });
    node_test_1.test("rejects invalid object", function () {
        var schema = index_1.r.object({
            name: index_1.r.string(),
            age: index_1.r.number()
        });
        var result = index_1.Validator.validate(schema, { name: "John", age: "thirty" });
        node_assert_1["default"].strictEqual(result.success, false);
    });
    node_test_1.test("requires all fields", function () {
        var _a;
        var schema = index_1.r.object({
            name: index_1.r.string(),
            age: index_1.r.number()
        });
        var result = index_1.Validator.validate(schema, { name: "John" });
        node_assert_1["default"].strictEqual(result.success, false);
        node_assert_1["default"]((_a = result.errors) === null || _a === void 0 ? void 0 : _a.some(function (e) { return e.code === "required"; }));
    });
    node_test_1.test("validates nested objects", function () {
        var schema = index_1.r.object({
            user: index_1.r.object({
                name: index_1.r.string(),
                email: index_1.r.string().email()
            })
        });
        var result = index_1.Validator.validate(schema, {
            user: { name: "John", email: "john@example.com" }
        });
        node_assert_1["default"].strictEqual(result.success, true);
    });
});
node_test_1.describe("Path Validation", function () {
    node_test_1.test("validates at specific path", function () {
        var schema = index_1.r.object({
            email: index_1.r.string().email()
        });
        var data = { email: "test@example.com" };
        var result = index_1.Validator.validateAtPath(schema, data, ["email"]);
        node_assert_1["default"].strictEqual(result.success, true);
    });
    node_test_1.test("detects error at specific path", function () {
        var schema = index_1.r.object({
            email: index_1.r.string().email()
        });
        var data = { email: "invalid" };
        var result = index_1.Validator.validateAtPath(schema, data, ["email"]);
        node_assert_1["default"].strictEqual(result.success, false);
    });
    node_test_1.test("validates nested path", function () {
        var schema = index_1.r.object({
            user: index_1.r.object({
                email: index_1.r.string().email()
            })
        });
        var data = { user: { email: "test@example.com" } };
        var result = index_1.Validator.validateAtPath(schema, data, ["user", "email"]);
        node_assert_1["default"].strictEqual(result.success, true);
    });
});
node_test_1.describe("Validator Methods", function () {
    node_test_1.test("parse() returns data on success", function () {
        var schema = index_1.r.string();
        var result = index_1.Validator.parse(schema, "hello");
        node_assert_1["default"].strictEqual(result, "hello");
    });
    node_test_1.test("parse() throws on failure", function () {
        var schema = index_1.r.string().email();
        node_assert_1["default"].throws(function () {
            index_1.Validator.parse(schema, "invalid");
        });
    });
    node_test_1.test("safeParse() returns success result", function () {
        var schema = index_1.r.string();
        var result = index_1.Validator.safeParse(schema, "hello");
        node_assert_1["default"].strictEqual(result.success, true);
        if (result.success) {
            node_assert_1["default"].strictEqual(result.data, "hello");
        }
    });
    node_test_1.test("safeParse() returns error result", function () {
        var schema = index_1.r.string().email();
        var result = index_1.Validator.safeParse(schema, "invalid");
        node_assert_1["default"].strictEqual(result.success, false);
        if (!result.success) {
            node_assert_1["default"](result.errors.length > 0);
        }
    });
});
node_test_1.describe("Type Inference", function () {
    node_test_1.test("infers string type", function () {
        var schema = index_1.r.string();
        var value = "test";
        node_assert_1["default"].strictEqual(typeof value, "string");
    });
    node_test_1.test("infers number type", function () {
        var schema = index_1.r.number();
        var value = 42;
        node_assert_1["default"].strictEqual(typeof value, "number");
    });
    node_test_1.test("infers object type", function () {
        var schema = index_1.r.object({
            name: index_1.r.string(),
            age: index_1.r.number()
        });
        var value = { name: "John", age: 30 };
        node_assert_1["default"].strictEqual(value.name, "John");
        node_assert_1["default"].strictEqual(value.age, 30);
    });
});
node_test_1.describe("Form Runtime", function () {
    node_test_1.test("creates form with default values", function () {
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
    node_test_1.test("sets field value", function () {
        var schema = index_1.r.object({ name: index_1.r.string() });
        var form = index_1.createForm({
            schema: schema,
            defaultValues: { name: "" },
            onSubmit: function () { }
        });
        form.setValue("name", "John");
        node_assert_1["default"].strictEqual(form.values.name, "John");
    });
    node_test_1.test("validates field on blur", function () {
        var schema = index_1.r.object({
            email: index_1.r.string().email()
        });
        var form = index_1.createForm({
            schema: schema,
            defaultValues: { email: "" },
            onSubmit: function () { },
            validateOnBlur: true
        });
        form.setValue("email", "invalid");
        form.handleBlur("email");
        node_assert_1["default"](form.errors.email !== null);
    });
    node_test_1.test("validates entire form", function () {
        var schema = index_1.r.object({
            name: index_1.r.string().min(2),
            email: index_1.r.string().email()
        });
        var form = index_1.createForm({
            schema: schema,
            defaultValues: { name: "J", email: "invalid" },
            onSubmit: function () { }
        });
        var errors = form.validateForm();
        node_assert_1["default"](errors.name !== null);
        node_assert_1["default"](errors.email !== null);
    });
    node_test_1.test("calls onSubmit with valid data", function () { return __awaiter(void 0, void 0, void 0, function () {
        var submitted, schema, form;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    submitted = false;
                    schema = index_1.r.object({ name: index_1.r.string() });
                    form = index_1.createForm({
                        schema: schema,
                        defaultValues: { name: "John" },
                        onSubmit: function (data) {
                            submitted = true;
                            node_assert_1["default"].strictEqual(data.name, "John");
                        }
                    });
                    return [4 /*yield*/, form.handleSubmit()];
                case 1:
                    _a.sent();
                    node_assert_1["default"](submitted);
                    return [2 /*return*/];
            }
        });
    }); });
    node_test_1.test("subscribes to form changes", function () {
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
});
node_test_1.describe("Error Structure", function () {
    node_test_1.test("error has correct structure", function () {
        var schema = index_1.r.string().email();
        var result = index_1.Validator.validate(schema, "invalid");
        node_assert_1["default"].strictEqual(result.success, false);
        if (result.errors) {
            var error = result.errors[0];
            node_assert_1["default"](Array.isArray(error.path));
            node_assert_1["default"](typeof error.code === "string");
            node_assert_1["default"](typeof error.message === "string");
        }
    });
    node_test_1.test("error includes path", function () {
        var schema = index_1.r.object({
            user: index_1.r.object({
                email: index_1.r.string().email()
            })
        });
        var result = index_1.Validator.validate(schema, {
            user: { email: "invalid" }
        });
        node_assert_1["default"].strictEqual(result.success, false);
        if (result.errors) {
            var error = result.errors[0];
            node_assert_1["default"](error.path.includes("email"));
        }
    });
});
node_test_1.describe("Performance", function () {
    node_test_1.test("validates quickly", function () {
        var schema = index_1.r.object({
            name: index_1.r.string(),
            email: index_1.r.string().email(),
            age: index_1.r.number().min(0).max(120)
        });
        var data = {
            name: "John Doe",
            email: "john@example.com",
            age: 30
        };
        var iterations = 100;
        var start = performance.now();
        for (var i = 0; i < iterations; i++) {
            index_1.Validator.validate(schema, data);
        }
        var end = performance.now();
        var avgTime = (end - start) / iterations;
        // Should validate in less than 1ms on average
        node_assert_1["default"](avgTime < 1, "Average validation time " + avgTime + "ms exceeds 1ms");
    });
});
