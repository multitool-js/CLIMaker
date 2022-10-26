import { CLICommand, CLICommandFullOptions } from '../lib/CliCommand';
import { Flag } from '../lib/Flag';
export declare type CLIOptions = {
    base?: string;
    throwOnMissingFlag?: boolean;
    throwOnMissingParam?: boolean;
    throwOnUnknownFlag?: boolean;
    throwOnUnexpectedTokens?: boolean;
    passthrough?: string | boolean;
    helpFlag?: {
        name?: string;
        shorthand?: string;
    } | boolean;
};
export declare class CLI {
    private $commandMap;
    private $commands;
    private $helpFlag;
    base: string;
    throwOnMissingFlag: boolean;
    throwOnMissingParam: boolean;
    throwOnUnknownFlag: boolean;
    throwOnUnexpectedTokens: boolean;
    passthrough: string | boolean;
    constructor(commands?: never[], { base, throwOnMissingFlag, throwOnMissingParam, throwOnUnknownFlag, throwOnUnexpectedTokens, passthrough, helpFlag }?: CLIOptions);
    get commands(): CLICommand[];
    get commandMap(): Record<string, CLICommand>;
    get helpFlag(): boolean | Flag | {
        name?: string;
        shorthand?: string;
    };
    set helpFlag(nextValue: boolean | Flag | {
        name?: string;
        shorthand?: string;
    });
    /**
     * Registers one or more commands to the cli
     * @param command Command(s) to register
     */
    register(command: CLICommand | CLICommandFullOptions | (CLICommand | CLICommandFullOptions)[]): CLICommand | CLICommand[];
    /**
     * Removes one or more commands from the cli
     * @param command Command(s) to unregister
     */
    unregister(command: string | CLICommand | (string | CLICommand)[]): boolean;
    /**
     * Prints the help text
     * @param commandName When defined prints only the defined command help text
     * @param extended Determines if the complete help is shown or only the condensed version. Defaults to `true` for single commands, `false` otherwise.
     */
    help(commandName?: string, extended?: boolean): void;
    /**
     * Runs a command, according to the passed arguments
     * @param args Arguments for the execution. Default to `process.argv.slice(2)`
     */
    execute(args?: string[]): any;
}
