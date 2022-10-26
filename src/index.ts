import { CLI } from './tools/cli';
import { Flag } from './lib/Flag';
import { Param } from './lib/Param';
import { CLICommand } from './lib/CLICommand';

const cli = new CLI();

export {
	CLI,
	Flag,
	Param,
	CLICommand,
	cli
};
