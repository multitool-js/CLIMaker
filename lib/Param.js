"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = void 0;
var Param = /** @class */ (function () {
    function Param(name, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.description, description = _c === void 0 ? '' : _c, _d = _b.variableName, variableName = _d === void 0 ? name : _d, _e = _b.required, required = _e === void 0 ? false : _e;
        if (!name)
            throw Error('Missing param name!');
        this.name = name;
        this.description = description;
        this.variableName = variableName;
        this.required = required;
    }
    /**
     * Returns the help text of the parameter
     */
    Param.prototype.helpText = function () {
        var text = this.name;
        if (this.required)
            text += ' (required)';
        if (this.description)
            text += ": ".concat(this.description);
        return text;
    };
    /**
     * Consumes the value of the parameter
     * @param args Arguments to consume
     */
    Param.prototype.consume = function (args) {
        if (args === void 0) { args = []; }
        return args.shift();
    };
    return Param;
}());
exports.Param = Param;
