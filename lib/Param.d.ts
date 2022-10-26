export declare interface ParamOptions {
    description?: string;
    variableName?: string;
    required?: boolean;
}
export declare interface ParamFullOptions extends ParamOptions {
    name: string;
}
export declare class Param {
    name: string;
    description?: string;
    variableName: string;
    required: boolean;
    constructor(name: string, { description, variableName, required }?: ParamOptions);
    /**
     * Returns the help text of the parameter
     */
    helpText(): string;
    /**
     * Consumes the value of the parameter
     * @param args Arguments to consume
     */
    consume(args?: string[]): string | undefined;
}
