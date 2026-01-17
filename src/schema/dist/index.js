"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.SchemaBuilder = exports.ZObject = exports.ZBoolean = exports.ZNumber = exports.ZString = exports.n = exports.z = exports.r = void 0;
var builders_1 = require("./builders");
exports.ZString = builders_1.ZString;
exports.ZNumber = builders_1.ZNumber;
exports.ZBoolean = builders_1.ZBoolean;
exports.ZObject = builders_1.ZObject;
exports.SchemaBuilder = builders_1.SchemaBuilder;
/**
 * Main schema builder API (Rustica-style)
 *
 * Usage:
 * ```typescript
 * const schema = r.object({
 *   email: r.string().min(3).email(),
 *   age: r.number().min(0).integer()
 * });
 * ```
 */
exports.r = {
    /**
     * Create a string schema
     */
    string: function () {
        return new builders_1.ZString();
    },
    /**
     * Create a number schema
     */
    number: function () {
        return new builders_1.ZNumber();
    },
    /**
     * Create a boolean schema
     */
    boolean: function () {
        return new builders_1.ZBoolean();
    },
    /**
     * Create an object schema
     */
    object: function (shape) {
        return new builders_1.ZObject(shape);
    }
};
// Keep 'z' and 'n' as aliases for backwards compatibility
exports.z = exports.r;
exports.n = exports.r;
__exportStar(require("./types"), exports);
