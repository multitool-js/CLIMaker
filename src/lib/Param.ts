export declare interface ParamOptions {
	description?: string,
	variableName?: string,
	required?: boolean
}
export declare interface ParamFullOptions extends ParamOptions {
	name: string
}

export class Param {
	name: string;
	description?: string;
	variableName: string;
	required: boolean;

	constructor(name: string, {
		description = '',
		variableName = name,
		required = false
	}: ParamOptions = {}) {
		if (!name) throw Error('Missing param name!');
		this.name = name;
		this.description = description;
		this.variableName = variableName;
		this.required = required;
	}

	/**
	 * Returns the help text of the parameter
	 */
	helpText() {
		let text = this.name;
		if (this.required) text += ' (required)';
		if (this.description) text += `: ${this.description}`;
		return text;
	}

	/**
	 * Consumes the value of the parameter
	 * @param args Arguments to consume
	 */
	consume(args: string[] = []) {
		return args.shift();
	}
}
