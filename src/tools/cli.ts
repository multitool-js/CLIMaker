import * as path from 'path';
import { CLICommand, CLICommandFullOptions } from '../lib/CliCommand';
import { Flag } from '../lib/Flag';

export declare type CLIOptions = {
	base?: string,
	throwOnMissingFlag?: boolean,
	throwOnMissingParam?: boolean,
	throwOnUnknownFlag?: boolean,
	throwOnUnexpectedTokens?: boolean,
	passthrough?: string|boolean,
	helpFlag?: {
		name?: string,
		shorthand?: string
	}|boolean
}

export class CLI {
	private $commandMap: Record<string, CLICommand>;
	private $commands: CLICommand[];
	private $helpFlag: Flag|false = false;
	base: string;
	throwOnMissingFlag: boolean;
	throwOnMissingParam: boolean;
	throwOnUnknownFlag: boolean;
	throwOnUnexpectedTokens: boolean;
	passthrough: string|boolean;

	constructor(commands = [], {
		base = process.env.CLI_MAKER_BASE || `node ${path.relative(process.cwd(), process.argv[1])}`,
		throwOnMissingFlag = true,
		throwOnMissingParam = true,
		throwOnUnknownFlag = false,
		throwOnUnexpectedTokens = false,
		passthrough = false,
		helpFlag = true
	}: CLIOptions = {}) {
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

	get commands() {
		return this.$commands;
	}

	get commandMap() {
		return this.$commandMap;
	}

	get helpFlag() {
		return this.$helpFlag;
	}

	set helpFlag(nextValue: boolean|Flag|{ name?: string, shorthand?: string }) {
		if (nextValue) {
			if (nextValue === true) nextValue = { name: 'help', shorthand: 'h' };
			this.$helpFlag = new Flag(nextValue.name || 'help', { shorthand: nextValue.shorthand });
		} else {
			this.$helpFlag = false;
		}
	}

	/**
	 * Registers one or more commands to the cli
	 * @param command Command(s) to register
	 */
	register(command: CLICommand|CLICommandFullOptions|(CLICommand|CLICommandFullOptions)[]): CLICommand|CLICommand[] {
		if (Array.isArray(command)) {
			return command.map((_c) => (this.register(_c) as CLICommand));
		}

		let cmd;
		if (command instanceof CLICommand) {
			cmd = command;
		} else {
			cmd = new CLICommand(command.name, command.exec, {
				throwOnMissingFlag: this.throwOnMissingFlag,
				throwOnMissingParam: this.throwOnMissingParam,
				throwOnUnknownFlag: this.throwOnUnknownFlag,
				throwOnUnexpectedTokens: this.throwOnUnexpectedTokens,
				passthrough: this.passthrough,
				...command
			});
		}
		/* const commandMap = {
			...this.$commandMap
		} */
		for (const alias of cmd.alias) {
			if (this.$commandMap[alias] && (this.$commandMap[alias] !== cmd)) throw Error(`A command with the same name or alias "${cmd.name}" already exists!`);
			this.$commandMap[alias] = cmd;
		}
		this.$commands.push(cmd);
		// this.$commands = [...this.$commands].push(cmd);
		// this.$commandMap = commandMap;
		return cmd;
	}

	/**
	 * Removes one or more commands from the cli
	 * @param command Command(s) to unregister
	 */
	unregister(command: string|CLICommand|(string|CLICommand)[]): boolean {
		if (Array.isArray(command)) {
			return command.reduce((value, _c) => (value && this.unregister(_c)), true);
		}
		if (typeof command == 'string') {
			command = this.$commands.find((cmd) => (cmd.alias.includes(command as string))) as CLICommand;
		}
		if (command instanceof CLICommand) {
			for (const [key, value] of Object.entries(this.$commandMap)) {
				if (value === command) delete this.$commandMap[key];
			}
			const index = this.$commands.findIndex((cmd) => (cmd === command));
			if (index >= 0) {
				this.$commands.splice(index, 1);
			}
			return true;
		}
		return false;
	}

	/**
	 * Prints the help text
	 * @param commandName When defined prints only the defined command help text
	 * @param extended Determines if the complete help is shown or only the condensed version. Defaults to `true` for single commands, `false` otherwise.
	 */
	help(commandName?: string, extended?: boolean) {
		if (commandName && this.$commandMap[commandName]) {
			console.info(this.$commandMap[commandName].helpText(extended === undefined ? true : extended, this.base) + '\n');
		} else {
			if (commandName) {
				console.info(`Unknown command "${commandName}"!`);
			}
			console.info('Available commands:\n');
			for (const command of this.$commands) {
				console.info(command.helpText(extended === undefined ? false : extended, this.base) + '\n');
			}
			console.info(`For more information run "${this.base} help --extended" or "${this.base} help <command>"`);
		}
	}

	/**
	 * Runs a command, according to the passed arguments
	 * @param args Arguments for the execution. Default to `process.argv.slice(2)`
	 */
	execute(args = process.argv.slice(2)) {
		const commandName = args.shift();
		if (!commandName) {
			console.error('Missing command!\n');
			return this.help();
		}
		if (this.$commandMap[commandName]) {
			if (this.$helpFlag && this.$helpFlag.consume(args)) {
				return this.help(commandName);
			} else {
				return this.$commandMap[commandName].execute(args);
			}
		}
		if (commandName === 'help') {
			return this.help(args.shift(), Flag.consumeBooleanFlag(args, 'extended'));
		} else {
			return this.help(commandName);
		}
	}
}
