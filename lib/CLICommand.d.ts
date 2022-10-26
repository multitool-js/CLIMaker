import { Flag, FlagOptions, FlagFullOptions } from './Flag';
import { Param, ParamOptions, ParamFullOptions } from './Param';
declare type ExecFunction = (values: Record<string, any>) => any;
export declare interface CLICommandOptions {
    base?: string;
    alias?: string | string[];
    description?: string;
    extendedDescription?: string;
    flags?: (FlagFullOptions | Flag)[] | Record<string, FlagOptions>;
    params?: (ParamFullOptions | Param)[] | Record<string, ParamOptions>;
    throwOnMissingFlag?: boolean;
    throwOnMissingParam?: boolean;
    throwOnUnknownFlag?: boolean;
    throwOnUnexpectedTokens?: boolean;
    passthrough?: string | boolean;
}
export declare interface CLICommandFullOptions extends CLICommandOptions {
    name: string;
    exec: ExecFunction;
}
export declare class CLICommand {
    name: string;
    private $exec;
    base: string;
    alias: string[];
    description: string;
    extendedDescription: string;
    throwOnMissingFlag: boolean;
    throwOnMissingParam: boolean;
    throwOnUnknownFlag: boolean;
    throwOnUnexpectedTokens: boolean;
    passthrough: string | false;
    flags: Flag[];
    params: Param[];
    constructor(name: string, exec: ExecFunction, { base, alias, description, extendedDescription, flags, params, throwOnMissingFlag, throwOnMissingParam, throwOnUnknownFlag, throwOnUnexpectedTokens, passthrough }?: CLICommandOptions);
    /**
     * Returns the help text of the flag
     * @param extended If true returns the extended version of the help text
     * @param base Override for the "base" value
     */
    helpText(extended?: boolean, base?: string): string;
    /**
     * Executes the command
     * @param args - Arguments to consume. Defaults to process.argv.slice(2)
     */
    execute(args?: string[]): any;
}
export {};
