"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flag = void 0;
var supportedTypes = ['bool', 'value', 'multivalue'];
var Flag = /** @class */ (function () {
    function Flag(name, _a) {
        var _b = _a === void 0 ? {} : _a, shorthand = _b.shorthand, _c = _b.type, type = _c === void 0 ? 'bool' : _c, _d = _b.description, description = _d === void 0 ? '' : _d, _e = _b.variableName, variableName = _e === void 0 ? name : _e, _f = _b.required, required = _f === void 0 ? false : _f;
        if (!name)
            throw Error('Missing flag name!');
        this.name = name;
        if (!supportedTypes.includes(type))
            throw Error("Unsupported flag type: \"".concat(type, "\""));
        this.type = type;
        if (shorthand && shorthand.length !== 1)
            throw Error('Shorthand property can only be of unit length.');
        this.shorthand = shorthand;
        this.description = description;
        this.variableName = variableName;
        this.required = required;
    }
    Flag.consumeBooleanFlag = function (args, flag, shorthand) {
        var index = args.findIndex(function (el) { return (el == "--".concat(flag) || (shorthand && el == "-".concat(shorthand))); });
        if (index >= 0) {
            args.splice(index, 1);
            return true;
        }
        else if (shorthand) {
            // check for aggregated shorthands
            var aggregatedIndex = args.findIndex(function (el) { return (el.match(new RegExp("^-[a-zA-Z]*".concat(shorthand, "[a-zA-Z]*$")))); });
            if (aggregatedIndex >= 0) {
                args.splice(aggregatedIndex, 1, args[aggregatedIndex].replace(shorthand, ''));
                return true;
            }
        }
        return false;
    };
    Flag.consumeValueFlag = function (args, flag, shorthand) {
        var index = args.findIndex(function (el) { return (el == "--".concat(flag) || (shorthand && el == "-".concat(shorthand))); });
        if (index >= 0) {
            return args.splice(index, 2)[1];
        }
        else {
            index = args.findIndex(function (el) { return (el.startsWith("--".concat(flag, "="))); });
            if (index >= 0) {
                return args.splice(index, 1)[0].replace("--".concat(flag, "="), '');
            }
            else if (shorthand) {
                index = args.findIndex(function (el) { return (el.startsWith("-".concat(shorthand, "="))); });
                if (index >= 0) {
                    return args.splice(index, 1)[0].replace("-".concat(shorthand, "="), '');
                }
            }
        }
        return undefined;
    };
    Flag.consumeMultiValueFlag = function (args, flag, shorthand) {
        var values = [];
        var value;
        do {
            value = Flag.consumeValueFlag(args, flag, shorthand);
        } while (value !== undefined);
        return values;
    };
    /**
     * Returns the help text of the flag
     */
    Flag.prototype.helpText = function () {
        var text = "--".concat(this.name);
        if (this.type == 'value' || this.type == 'multivalue')
            text += "=<".concat(this.name, ">");
        if (this.shorthand)
            text += " | -".concat(this.shorthand);
        if (this.type == 'value' || this.type == 'multivalue')
            text += "=<".concat(this.name, ">");
        if (this.required)
            text += ' (required)';
        if (this.description)
            text += ": ".concat(this.description);
        return text;
    };
    /**
     * Consumes the value of the flag, according to its type
     * @param args Arguments to consume
     */
    Flag.prototype.consume = function (args) {
        if (args === void 0) { args = []; }
        switch (this.type) {
            case 'bool':
                return Flag.consumeBooleanFlag(args, this.name, this.shorthand);
            case 'value':
                return Flag.consumeValueFlag(args, this.name, this.shorthand);
            case 'multivalue':
                return Flag.consumeMultiValueFlag(args, this.name, this.shorthand);
        }
    };
    return Flag;
}());
exports.Flag = Flag;
