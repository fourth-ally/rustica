"use strict";
/**
 * Schema Builder Tests
 */
exports.__esModule = true;
var node_test_1 = require("node:test");
var node_assert_1 = require("node:assert");
var index_1 = require("../src/index");
node_test_1.describe("Schema Builders", function () {
    node_test_1.describe("String Schema", function () {
        node_test_1.it("should create basic string schema", function () {
            var schema = index_1.r.string();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.type, "string");
        });
        node_test_1.it("should add min constraint", function () {
            var schema = index_1.r.string().min(5);
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.min, 5);
        });
        node_test_1.it("should add max constraint", function () {
            var schema = index_1.r.string().max(100);
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.max, 100);
        });
        node_test_1.it("should chain min and max", function () {
            var schema = index_1.r.string().min(5).max(100);
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.min, 5);
            node_assert_1["default"].strictEqual(json.max, 100);
        });
        node_test_1.it("should add email validation", function () {
            var schema = index_1.r.string().email();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.email, true);
        });
        node_test_1.it("should add url validation", function () {
            var schema = index_1.r.string().url();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.url, true);
        });
        node_test_1.it("should add pattern validation", function () {
            var schema = index_1.r.string().pattern("^[a-z]+$");
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.pattern, "^[a-z]+$");
        });
        node_test_1.it("should add UI config", function () {
            var _a, _b;
            var schema = index_1.r
                .string()
                .ui({ label: "Email", placeholder: "Enter email" });
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual((_a = json.ui) === null || _a === void 0 ? void 0 : _a.label, "Email");
            node_assert_1["default"].strictEqual((_b = json.ui) === null || _b === void 0 ? void 0 : _b.placeholder, "Enter email");
        });
        node_test_1.it("should chain all methods", function () {
            var _a;
            var schema = index_1.r.string().min(3).max(50).email().ui({ label: "Email" });
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.type, "string");
            node_assert_1["default"].strictEqual(json.min, 3);
            node_assert_1["default"].strictEqual(json.max, 50);
            node_assert_1["default"].strictEqual(json.email, true);
            node_assert_1["default"].strictEqual((_a = json.ui) === null || _a === void 0 ? void 0 : _a.label, "Email");
        });
    });
    node_test_1.describe("Number Schema", function () {
        node_test_1.it("should create basic number schema", function () {
            var schema = index_1.r.number();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.type, "number");
        });
        node_test_1.it("should add min constraint", function () {
            var schema = index_1.r.number().min(0);
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.min, 0);
        });
        node_test_1.it("should add max constraint", function () {
            var schema = index_1.r.number().max(100);
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.max, 100);
        });
        node_test_1.it("should add integer constraint", function () {
            var schema = index_1.r.number().integer();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.integer, true);
        });
        node_test_1.it("should add positive constraint", function () {
            var schema = index_1.r.number().positive();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.positive, true);
        });
        node_test_1.it("should chain all number methods", function () {
            var schema = index_1.r.number().min(0).max(120).integer().positive();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.min, 0);
            node_assert_1["default"].strictEqual(json.max, 120);
            node_assert_1["default"].strictEqual(json.integer, true);
            node_assert_1["default"].strictEqual(json.positive, true);
        });
    });
    node_test_1.describe("Boolean Schema", function () {
        node_test_1.it("should create boolean schema", function () {
            var schema = index_1.r.boolean();
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.type, "boolean");
        });
        node_test_1.it("should support UI config", function () {
            var _a;
            var schema = index_1.r.boolean().ui({ label: "Accept terms" });
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual((_a = json.ui) === null || _a === void 0 ? void 0 : _a.label, "Accept terms");
        });
    });
    node_test_1.describe("Object Schema", function () {
        node_test_1.it("should create object schema", function () {
            var schema = index_1.r.object({
                name: index_1.r.string(),
                age: index_1.r.number()
            });
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.type, "object");
            node_assert_1["default"](json.shape);
            node_assert_1["default"](json.shape.name);
            node_assert_1["default"](json.shape.age);
        });
        node_test_1.it("should handle nested objects", function () {
            var schema = index_1.r.object({
                user: index_1.r.object({
                    name: index_1.r.string(),
                    email: index_1.r.string().email()
                })
            });
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.type, "object");
            node_assert_1["default"].strictEqual(json.shape.user.type, "object");
            node_assert_1["default"](json.shape.user.shape.name);
            node_assert_1["default"](json.shape.user.shape.email);
        });
        node_test_1.it("should preserve all field constraints", function () {
            var schema = index_1.r.object({
                email: index_1.r.string().min(5).email(),
                age: index_1.r.number().min(18).integer(),
                agreed: index_1.r.boolean()
            });
            var json = schema.toJSON();
            node_assert_1["default"].strictEqual(json.shape.email.min, 5);
            node_assert_1["default"].strictEqual(json.shape.email.email, true);
            node_assert_1["default"].strictEqual(json.shape.age.min, 18);
            node_assert_1["default"].strictEqual(json.shape.age.integer, true);
            node_assert_1["default"].strictEqual(json.shape.agreed.type, "boolean");
        });
    });
    node_test_1.describe("Type Inference", function () {
        node_test_1.it("should infer string type", function () {
            var schema = index_1.r.string();
            var value = "test";
            node_assert_1["default"].strictEqual(typeof value, "string");
        });
        node_test_1.it("should infer number type", function () {
            var schema = index_1.r.number();
            var value = 42;
            node_assert_1["default"].strictEqual(typeof value, "number");
        });
        node_test_1.it("should infer boolean type", function () {
            var schema = index_1.r.boolean();
            var value = true;
            node_assert_1["default"].strictEqual(typeof value, "boolean");
        });
        node_test_1.it("should infer object type", function () {
            var schema = index_1.r.object({
                name: index_1.r.string(),
                age: index_1.r.number(),
                active: index_1.r.boolean()
            });
            var value = {
                name: "John",
                age: 30,
                active: true
            };
            node_assert_1["default"].strictEqual(value.name, "John");
            node_assert_1["default"].strictEqual(value.age, 30);
            node_assert_1["default"].strictEqual(value.active, true);
        });
    });
});
