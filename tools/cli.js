"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
var path = require("path");
var CliCommand_1 = require("../lib/CliCommand");
var Flag_1 = require("../lib/Flag");
var CLI = /** @class */ (function () {
    function CLI(commands, _a) {
        if (commands === void 0) { commands = []; }
        var _b = _a === void 0 ? {} : _a, _d = _b.base, base = _d === void 0 ? process.env.CLI_MAKER_BASE || "node ".concat(path.relative(process.cwd(), process.argv[1])) : _d, _e = _b.throwOnMissingFlag, throwOnMissingFlag = _e === void 0 ? true : _e, _f = _b.throwOnMissingParam, throwOnMissingParam = _f === void 0 ? true : _f, _g = _b.throwOnUnknownFlag, throwOnUnknownFlag = _g === void 0 ? false : _g, _h = _b.throwOnUnexpectedTokens, throwOnUnexpectedTokens = _h === void 0 ? false : _h, _j = _b.passthrough, passthrough = _j === void 0 ? false : _j, _k = _b.helpFlag, helpFlag = _k === void 0 ? true : _k;
        this.$helpFlag = false;
        this.$commandMap = {};
        this.$commands = [];
        this.helpFlag = helpFlag;
        this.base = base;
        this.throwOnMissingFlag = throwOnMissingFlag;
        this.throwOnMissingParam = throwOnMissingParam;
        this.throwOnUnknownFlag = throwOnUnknownFlag;
        this.throwOnUnexpectedTokens = throwOnUnexpectedTokens;
        this.passthrough = passthrough;
        this.register(commands);
    }
    Object.defineProperty(CLI.prototype, "commands", {
        get: function () {
            return this.$commands;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLI.prototype, "commandMap", {
        get: function () {
            return this.$commandMap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLI.prototype, "helpFlag", {
        get: function () {
            return this.$helpFlag;
        },
        set: function (nextValue) {
            if (nextValue) {
                if (nextValue === true)
                    nextValue = { name: 'help', shorthand: 'h' };
                this.$helpFlag = new Flag_1.Flag(nextValue.name || 'help', { shorthand: nextValue.shorthand });
            }
            else {
                this.$helpFlag = false;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Registers one or more commands to the cli
     * @param command Command(s) to register
     */
    CLI.prototype.register = function (command) {
        var _this = this;
        if (Array.isArray(command)) {
            return command.map(function (_c) { return _this.register(_c); });
        }
        var cmd;
        if (command instanceof CliCommand_1.CLICommand) {
            cmd = command;
        }
        else {
            cmd = new CliCommand_1.CLICommand(command.name, command.exec, __assign({ throwOnMissingFlag: this.throwOnMissingFlag, throwOnMissingParam: this.throwOnMissingParam, throwOnUnknownFlag: this.throwOnUnknownFlag, throwOnUnexpectedTokens: this.throwOnUnexpectedTokens, passthrough: this.passthrough }, command));
        }
        /* const commandMap = {
            ...this.$commandMap
        } */
        for (var _i = 0, _a = cmd.alias; _i < _a.length; _i++) {
            var alias = _a[_i];
            if (this.$commandMap[alias] && (this.$commandMap[alias] !== cmd))
                throw Error("A command with the same name or alias \"".concat(cmd.name, "\" already exists!"));
            this.$commandMap[alias] = cmd;
        }
        this.$commands.push(cmd);
        // this.$commands = [...this.$commands].push(cmd);
        // this.$commandMap = commandMap;
        return cmd;
    };
    /**
     * Removes one or more commands from the cli
     * @param command Command(s) to unregister
     */
    CLI.prototype.unregister = function (command) {
        var _this = this;
        if (Array.isArray(command)) {
            return command.reduce(function (value, _c) { return (value && _this.unregister(_c)); }, true);
        }
        if (typeof command == 'string') {
            command = this.$commands.find(function (cmd) { return (cmd.alias.includes(command)); });
        }
        if (command instanceof CliCommand_1.CLICommand) {
            for (var _i = 0, _a = Object.entries(this.$commandMap); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value === command)
                    delete this.$commandMap[key];
            }
            var index = this.$commands.findIndex(function (cmd) { return (cmd === command); });
            if (index >= 0) {
                this.$commands.splice(index, 1);
            }
            return true;
        }
        return false;
    };
    /**
     * Prints the help text
     * @param commandName When defined prints only the defined command help text
     * @param extended Determines if the complete help is shown or only the condensed version. Defaults to `true` for single commands, `false` otherwise.
     */
    CLI.prototype.help = function (commandName, extended) {
        if (commandName && this.$commandMap[commandName]) {
            console.info(this.$commandMap[commandName].helpText(extended === undefined ? true : extended, this.base) + '\n');
        }
        else {
            if (commandName) {
                console.info("Unknown command \"".concat(commandName, "\"!"));
            }
            console.info('Available commands:\n');
            for (var _i = 0, _a = this.$commands; _i < _a.length; _i++) {
                var command = _a[_i];
                console.info(command.helpText(extended === undefined ? false : extended, this.base) + '\n');
            }
            console.info("For more information run \"".concat(this.base, " help --extended\" or \"").concat(this.base, " help <command>\""));
        }
    };
    /**
     * Runs a command, according to the passed arguments
     * @param args Arguments for the execution. Default to `process.argv.slice(2)`
     */
    CLI.prototype.execute = function (args) {
        if (args === void 0) { args = process.argv.slice(2); }
        var commandName = args.shift();
        if (!commandName) {
            console.error('Missing command!\n');
            return this.help();
        }
        if (this.$commandMap[commandName]) {
            if (this.$helpFlag && this.$helpFlag.consume(args)) {
                return this.help(commandName);
            }
            else {
                return this.$commandMap[commandName].execute(args);
            }
        }
        if (commandName === 'help') {
            return this.help(args.shift(), Flag_1.Flag.consumeBooleanFlag(args, 'extended'));
        }
        else {
            return this.help(commandName);
        }
    };
    return CLI;
}());
exports.CLI = CLI;
