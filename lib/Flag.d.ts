declare const supportedTypes: readonly ["bool", "value", "multivalue"];
declare type FlagType = typeof supportedTypes[number];
export declare interface FlagOptions {
    shorthand?: string;
    type?: FlagType;
    description?: string;
    variableName?: string;
    required?: boolean;
}
export declare interface FlagFullOptions extends FlagOptions {
    name: string;
}
export declare class Flag {
    static consumeBooleanFlag(args: string[], flag: string, shorthand?: string): boolean;
    static consumeValueFlag(args: string[], flag: string, shorthand?: string): string | undefined;
    static consumeMultiValueFlag(args: string[], flag: string, shorthand?: string): string[];
    name: string;
    type: FlagType;
    shorthand?: string;
    description?: string;
    variableName: string;
    required: boolean;
    constructor(name: string, { shorthand, type, description, variableName, required }?: FlagOptions);
    /**
     * Returns the help text of the flag
     */
    helpText(): string;
    /**
     * Consumes the value of the flag, according to its type
     * @param args Arguments to consume
     */
    consume(args?: string[]): string | boolean | string[] | undefined;
}
export {};
