const supportedTypes = ['bool', 'value', 'multivalue'] as const;

type FlagType = typeof supportedTypes[number];
export declare interface FlagOptions {
	shorthand?: string,
	type?: FlagType,
	description?: string,
	variableName?: string,
	required?: boolean
}
export declare interface FlagFullOptions extends FlagOptions {
	name: string
}

export class Flag {
	static consumeBooleanFlag(args: string[], flag: string, shorthand?: string) {
		const index = args.findIndex((el) => (el == `--${flag}` || (shorthand && el == `-${shorthand}`)));
		if (index >= 0) {
			args.splice(index, 1);
			return true;
		} else if (shorthand) {
			// check for aggregated shorthands
			const aggregatedIndex = args.findIndex((el) => (el.match(new RegExp(`^-[a-zA-Z]*${shorthand}[a-zA-Z]*$`))));
			if (aggregatedIndex >= 0) {
				args.splice(aggregatedIndex, 1, args[aggregatedIndex].replace(shorthand, ''));
				return true;
			}
		}
		return false;
	}

	static consumeValueFlag(args: string[], flag: string, shorthand?: string) {
		let index = args.findIndex((el: string) => (el == `--${flag}` || (shorthand && el == `-${shorthand}`)));
		if (index >= 0) {
			return args.splice(index, 2)[1];
		} else {
			index = args.findIndex((el: string) => (el.startsWith(`--${flag}=`)));
			if (index >= 0) {
				return args.splice(index, 1)[0].replace(`--${flag}=`, '');
			} else if (shorthand) {
				index = args.findIndex((el: string) => (el.startsWith(`-${shorthand}=`)));
				if (index >= 0) {
					return args.splice(index, 1)[0].replace(`-${shorthand}=`, '');
				}
			}
		}
		return undefined;
	}

	static consumeMultiValueFlag(args: string[], flag: string, shorthand?: string) {
		const values: string[] = [];
		let value;
		do {
			value = Flag.consumeValueFlag(args, flag, shorthand);
		} while (value !== undefined);
		return values;
	}

	name: string;
	type: FlagType;
	shorthand?: string;
	description?: string;
	variableName: string;
	required: boolean;

	constructor(name: string, {
		shorthand,
		type = 'bool',
		description = '',
		variableName = name,
		required = false
	}: FlagOptions = {}) {
		if (!name) throw Error('Missing flag name!');
		this.name = name;
		if (!(supportedTypes as ReadonlyArray<string> as string[]).includes(type)) throw Error(`Unsupported flag type: "${type}"`);
		this.type = type;
		if (shorthand && shorthand.length !== 1) throw Error('Shorthand property can only be of unit length.');
		this.shorthand = shorthand;
		this.description = description;
		this.variableName = variableName;
		this.required = required;
	}

	/**
	 * Returns the help text of the flag
	 */
	helpText() {
		let text = `--${this.name}`;
		if (this.type == 'value' || this.type == 'multivalue') text += `=<${this.name}>`;
		if (this.shorthand) text += ` | -${this.shorthand}`;
		if (this.type == 'value' || this.type == 'multivalue') text += `=<${this.name}>`;
		if (this.required) text += ' (required)';
		if (this.description) text += `: ${this.description}`;
		return text;
	}

	/**
	 * Consumes the value of the flag, according to its type
	 * @param args Arguments to consume
	 */
	consume(args: string[] = []) {
		switch (this.type) {
			case 'bool':
				return Flag.consumeBooleanFlag(args, this.name, this.shorthand);
			case 'value':
				return Flag.consumeValueFlag(args, this.name, this.shorthand);
			case 'multivalue':
				return Flag.consumeMultiValueFlag(args, this.name, this.shorthand);
		}
	}
}
