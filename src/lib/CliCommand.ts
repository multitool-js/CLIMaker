import * as path from 'path';
import { Flag, FlagOptions, FlagFullOptions } from './Flag';
import { Param, ParamOptions, ParamFullOptions } from './Param';

type ExecFunction = (values: Record<string, any>) => any;
export declare interface CLICommandOptions {
	base?: string,
	alias?: string|string[],
	description?: string,
	extendedDescription?: string,
	flags?: (FlagFullOptions|Flag)[]|Record<string, FlagOptions>,
	params?: (ParamFullOptions|Param)[]|Record<string, ParamOptions>,
	throwOnMissingFlag?: boolean,
	throwOnMissingParam?: boolean,
	throwOnUnknownFlag?: boolean,
	throwOnUnexpectedTokens?: boolean,
	passthrough?: string|boolean
}
export declare interface CLICommandFullOptions extends CLICommandOptions {
	name: string,
	exec: ExecFunction
}

export class CLICommand {
	name: string;
	private $exec: ExecFunction;
	base: string;
	alias: string[];
	description: string;
	extendedDescription: string;
	throwOnMissingFlag: boolean;
	throwOnMissingParam: boolean;
	throwOnUnknownFlag: boolean;
	throwOnUnexpectedTokens: boolean;
	passthrough: string|false;
	flags: Flag[];
	params: Param[];

	constructor(name: string, exec: ExecFunction, {
		base = `node ${path.relative(process.cwd(), process.argv[1])}`,
		alias,
		description = '',
		extendedDescription = '',
		flags,
		params,
		throwOnMissingFlag = true,
		throwOnMissingParam = true,
		throwOnUnknownFlag = false,
		throwOnUnexpectedTokens = false,
		passthrough = false
	}: CLICommandOptions = {}) {
		if (!name) throw Error('Missing command name!');
		this.name = name;
		if (!exec) throw Error('Missing command execution callback!');
		this.$exec = exec;
		this.base = base;
		this.alias = [name];
		if (Array.isArray(alias)) {
			this.alias.push(...alias);
		} else if (alias) {
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
			for (const flag of flags) {
				this.flags.push(new Flag(flag.name, flag));
			}
		} else if (flags && typeof flags == 'object') {
			for (const [name, options] of Object.entries(flags)) {
				this.flags.push(new Flag(name, options));
			}
		}
		this.params = [];
		if (Array.isArray(params)) {
			for (const param of params) {
				this.params.push(new Param(param.name, param));
			}
		} else if (params && typeof params == 'object') {
			for (const [name, options] of Object.entries(params)) {
				this.params.push(new Param(name, options));
			}
		}
	}

	/**
	 * Returns the help text of the flag
	 * @param extended If true returns the extended version of the help text
	 * @param base Override for the "base" value
	 */
	helpText(extended = false, base = this.base) {
		let text = this.alias.join(' | ');
		text += ':\n';
		if (this.description) text += `${this.description.replace(/^/gm, '  ')}`;
		if (extended) {
			text += '\n';
			if (this.extendedDescription) text += `${this.extendedDescription.replace(/^/gm, '  ')}\n`;
			if (this.flags.length) {
				text += '  flags:\n';
				for (const flag of this.flags) {
					text += `    ${flag.helpText()}\n`;
				}
			}
			if (this.params.length) {
				text += '  parameters:\n';
				for (const param of this.params) {
					text += `    ${param.helpText()}\n`;
				}
			}
			text += '  usage:\n';
			text += `    ${base} ${this.name}`;
			for (const param of (this.params || [])) {
				text += ` <${param.name}>`;
			}
			if (this.flags.length) {
				text += ' <flags[]>';
			}
		}
		return text;
	}

	/**
	 * Executes the command
	 * @param args - Arguments to consume. Defaults to process.argv.slice(2)
	 */
	execute(args: string[] = process.argv.slice(2)) {
		const values: Record<string, any> = {};
		for (const flag of this.flags) {
			const value = flag.consume(args);
			if (this.throwOnMissingFlag && flag.required && value === undefined) throw Error(`Missing required flag "--${flag}"!`);
			values[flag.variableName] = value;
		}
		for (const param of this.params) {
			const value = param.consume(args);
			if (this.throwOnMissingParam && param.required && value === undefined) throw Error(`Missing required parameter "${param}"!`);
			values[param.variableName] = value;
		}
		if (this.throwOnUnknownFlag) {
			const unexpected = args.filter((arg = '') => (arg.match(/^--?[a-zA-Z0-9]/)));
			if (unexpected.length) {
				throw Error(`Found unknown additional flags: "${unexpected.join('", "')}"`);
			}
		}
		if (this.throwOnUnexpectedTokens && args.length) {
			throw Error(`Found unexpected additional tokens: "${args.join('", "')}"`);
		}
		if (this.passthrough) values[this.passthrough] = [...args];
		return this.$exec(values);
	}
}
