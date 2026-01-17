"use strict";
/**
 * Schema Builder Tests
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
    node_test_1.describe("Backwards Compatibility", function () {
        node_test_1.it("should support z alias", function () { return __awaiter(void 0, void 0, void 0, function () {
            var z, schema, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../src/index.js"); })];
                    case 1:
                        z = (_a.sent()).z;
                        schema = z.string().min(5);
                        json = schema.toJSON();
                        node_assert_1["default"].strictEqual(json.type, "string");
                        node_assert_1["default"].strictEqual(json.min, 5);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
