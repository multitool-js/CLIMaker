"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLICommand = void 0;
var path = require("path");
var Flag_1 = require("./Flag");
var Param_1 = require("./Param");
var CLICommand = /** @class */ (function () {
    function CLICommand(name, exec, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.base, base = _d === void 0 ? "node ".concat(path.relative(process.cwd(), process.argv[1])) : _d, alias = _c.alias, _e = _c.description, description = _e === void 0 ? '' : _e, _f = _c.extendedDescription, extendedDescription = _f === void 0 ? '' : _f, flags = _c.flags, params = _c.params, _g = _c.throwOnMissingFlag, throwOnMissingFlag = _g === void 0 ? true : _g, _h = _c.throwOnMissingParam, throwOnMissingParam = _h === void 0 ? true : _h, _j = _c.throwOnUnknownFlag, throwOnUnknownFlag = _j === void 0 ? false : _j, _k = _c.throwOnUnexpectedTokens, throwOnUnexpectedTokens = _k === void 0 ? false : _k, _l = _c.passthrough, passthrough = _l === void 0 ? false : _l;
        if (!name)
            throw Error('Missing command name!');
        this.name = name;
        if (!exec)
            throw Error('Missing command execution callback!');
        this.$exec = exec;
        this.base = base;
        this.alias = [name];
        if (Array.isArray(alias)) {
            (_b = this.alias).push.apply(_b, alias);
        }
        else if (alias) {
            this.alias.push(alias);
        }
        this.description = description.trim();
        this.extendedDescription = extendedDescription.trim();
        this.throwOnMissingFlag = throwOnMissingFlag;
        this.throwOnMissingParam = throwOnMissingParam;
        this.throwOnUnknownFlag = throwOnUnknownFlag;
        this.throwOnUnexpectedTokens = throwOnUnexpectedTokens;
        this.passthrough = (passthrough === true ? '__args' : false);
        this.flags = [];
        if (Array.isArray(flags)) {
            for (var _i = 0, flags_1 = flags; _i < flags_1.length; _i++) {
                var flag = flags_1[_i];
                this.flags.push(new Flag_1.Flag(flag.name, flag));
            }
        }
        else if (flags && typeof flags == 'object') {
            for (var _m = 0, _o = Object.entries(flags); _m < _o.length; _m++) {
                var _p = _o[_m], name_1 = _p[0], options = _p[1];
                this.flags.push(new Flag_1.Flag(name_1, options));
            }
        }
        this.params = [];
        if (Array.isArray(params)) {
            for (var _q = 0, params_1 = params; _q < params_1.length; _q++) {
                var param = params_1[_q];
                this.params.push(new Param_1.Param(param.name, param));
            }
        }
        else if (params && typeof params == 'object') {
            for (var _r = 0, _s = Object.entries(params); _r < _s.length; _r++) {
                var _t = _s[_r], name_2 = _t[0], options = _t[1];
                this.params.push(new Param_1.Param(name_2, options));
            }
        }
    }
    /**
     * Returns the help text of the flag
     * @param extended If true returns the extended version of the help text
     * @param base Override for the "base" value
     */
    CLICommand.prototype.helpText = function (extended, base) {
        if (extended === void 0) { extended = false; }
        if (base === void 0) { base = this.base; }
        var text = this.alias.join(' | ');
        text += ':\n';
        if (this.description)
            text += "".concat(this.description.replace(/^/gm, '  '));
        if (extended) {
            text += '\n';
            if (this.extendedDescription)
                text += "".concat(this.extendedDescription.replace(/^/gm, '  '), "\n");
            if (this.flags.length) {
                text += '  flags:\n';
                for (var _i = 0, _a = this.flags; _i < _a.length; _i++) {
                    var flag = _a[_i];
                    text += "    ".concat(flag.helpText(), "\n");
                }
            }
            if (this.params.length) {
                text += '  parameters:\n';
                for (var _b = 0, _c = this.params; _b < _c.length; _b++) {
                    var param = _c[_b];
                    text += "    ".concat(param.helpText(), "\n");
                }
            }
            text += '  usage:\n';
            text += "    ".concat(base, " ").concat(this.name);
            for (var _d = 0, _e = (this.params || []); _d < _e.length; _d++) {
                var param = _e[_d];
                text += " <".concat(param.name, ">");
            }
            if (this.flags.length) {
                text += ' <flags[]>';
            }
        }
        return text;
    };
    /**
     * Executes the command
     * @param args - Arguments to consume. Defaults to process.argv.slice(2)
     */
    CLICommand.prototype.execute = function (args) {
        if (args === void 0) { args = process.argv.slice(2); }
        var values = {};
        for (var _i = 0, _a = this.flags; _i < _a.length; _i++) {
            var flag = _a[_i];
            var value = flag.consume(args);
            if (this.throwOnMissingFlag && flag.required && value === undefined)
                throw Error("Missing required flag \"--".concat(flag, "\"!"));
            values[flag.variableName] = value;
        }
        for (var _b = 0, _c = this.params; _b < _c.length; _b++) {
            var param = _c[_b];
            var value = param.consume(args);
            if (this.throwOnMissingParam && param.required && value === undefined)
                throw Error("Missing required parameter \"".concat(param, "\"!"));
            values[param.variableName] = value;
        }
        if (this.throwOnUnknownFlag) {
            var unexpected = args.filter(function (arg) {
                if (arg === void 0) { arg = ''; }
                return (arg.match(/^--?[a-zA-Z0-9]/));
            });
            if (unexpected.length) {
                throw Error("Found unknown additional flags: \"".concat(unexpected.join('", "'), "\""));
            }
        }
        if (this.throwOnUnexpectedTokens && args.length) {
            throw Error("Found unexpected additional tokens: \"".concat(args.join('", "'), "\""));
        }
        if (this.passthrough)
            values[this.passthrough] = __spreadArray([], args, true);
        return this.$exec(values);
    };
    return CLICommand;
}());
exports.CLICommand = CLICommand;
