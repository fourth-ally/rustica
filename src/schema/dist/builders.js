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
exports.__esModule = true;
exports.ZObject = exports.ZBoolean = exports.ZNumber = exports.ZString = exports.SchemaBuilder = void 0;
/**
 * Base class for all schema builders
 */
var SchemaBuilder = /** @class */ (function () {
    function SchemaBuilder() {
    }
    return SchemaBuilder;
}());
exports.SchemaBuilder = SchemaBuilder;
/**
 * String schema builder with fluent API
 */
var ZString = /** @class */ (function (_super) {
    __extends(ZString, _super);
    function ZString() {
        var _this = _super.call(this) || this;
        _this.schema = { type: "string" };
        return _this;
    }
    /**
     * Set minimum length constraint
     */
    ZString.prototype.min = function (length) {
        this.schema.min = length;
        return this;
    };
    /**
     * Set maximum length constraint
     */
    ZString.prototype.max = function (length) {
        this.schema.max = length;
        return this;
    };
    /**
     * Mark as email validation
     */
    ZString.prototype.email = function () {
        this.schema.email = true;
        return this;
    };
    /**
     * Mark as URL validation
     */
    ZString.prototype.url = function () {
        this.schema.url = true;
        return this;
    };
    /**
     * Add pattern matching
     */
    ZString.prototype.pattern = function (regex) {
        this.schema.pattern = regex;
        return this;
    };
    /**
     * Add UI configuration
     */
    ZString.prototype.ui = function (config) {
        this.schema.ui = config;
        return this;
    };
    /**
     * Add custom error messages
     */
    ZString.prototype.messages = function (messages) {
        this.schema.messages = messages;
        return this;
    };
    /**
     * Serialize to JSON for Rust validation
     */
    ZString.prototype.toJSON = function () {
        return __assign({}, this.schema);
    };
    return ZString;
}(SchemaBuilder));
exports.ZString = ZString;
/**
 * Number schema builder with fluent API
 */
var ZNumber = /** @class */ (function (_super) {
    __extends(ZNumber, _super);
    function ZNumber() {
        var _this = _super.call(this) || this;
        _this.schema = { type: "number" };
        return _this;
    }
    /**
     * Set minimum value constraint
     */
    ZNumber.prototype.min = function (value) {
        this.schema.min = value;
        return this;
    };
    /**
     * Set maximum value constraint
     */
    ZNumber.prototype.max = function (value) {
        this.schema.max = value;
        return this;
    };
    /**
     * Require integer values only
     */
    ZNumber.prototype.integer = function () {
        this.schema.integer = true;
        return this;
    };
    /**
     * Require positive values only
     */
    ZNumber.prototype.positive = function () {
        this.schema.positive = true;
        return this;
    };
    /**
     * Add UI configuration
     */
    ZNumber.prototype.ui = function (config) {
        this.schema.ui = config;
        return this;
    };
    /**
     * Add custom error messages
     */
    ZNumber.prototype.messages = function (messages) {
        this.schema.messages = messages;
        return this;
    };
    /**
     * Serialize to JSON for Rust validation
     */
    ZNumber.prototype.toJSON = function () {
        return __assign({}, this.schema);
    };
    return ZNumber;
}(SchemaBuilder));
exports.ZNumber = ZNumber;
/**
 * Boolean schema builder with fluent API
 */
var ZBoolean = /** @class */ (function (_super) {
    __extends(ZBoolean, _super);
    function ZBoolean() {
        var _this = _super.call(this) || this;
        _this.schema = { type: "boolean" };
        return _this;
    }
    /**
     * Add UI configuration
     */
    ZBoolean.prototype.ui = function (config) {
        this.schema.ui = config;
        return this;
    };
    /**
     * Add custom error messages
     */
    ZBoolean.prototype.messages = function (messages) {
        this.schema.messages = messages;
        return this;
    };
    /**
     * Serialize to JSON for Rust validation
     */
    ZBoolean.prototype.toJSON = function () {
        return __assign({}, this.schema);
    };
    return ZBoolean;
}(SchemaBuilder));
exports.ZBoolean = ZBoolean;
/**
 * Object schema builder with fluent API
 */
var ZObject = /** @class */ (function (_super) {
    __extends(ZObject, _super);
    function ZObject(shape) {
        var _this = _super.call(this) || this;
        // Convert SchemaBuilder instances to their JSON representation
        var jsonShape = {};
        for (var _i = 0, _a = Object.entries(shape); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            jsonShape[key] = value.toJSON();
        }
        _this.schema = {
            type: "object",
            shape: jsonShape
        };
        return _this;
    }
    /**
     * Add UI configuration
     */
    ZObject.prototype.ui = function (config) {
        this.schema.ui = config;
        return this;
    };
    /**
     * Add custom error messages
     */
    ZObject.prototype.messages = function (messages) {
        this.schema.messages = messages;
        return this;
    };
    /**
     * Serialize to JSON for Rust validation
     */
    ZObject.prototype.toJSON = function () {
        return __assign({}, this.schema);
    };
    return ZObject;
}(SchemaBuilder));
exports.ZObject = ZObject;
