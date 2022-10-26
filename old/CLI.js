const commands = {};
let help = false;

const flag = {
	flag: 'abcd',
	alias: ['a'],
	param: false // required, possible, no?
};

function register(command, callback, {
	description,
	flags,
	requiredFlags,
	params,
	validate,
	raw
} = {}) {
	commands[command] = {
		callback,
		description,
		flags,
		requiredFlags,
		params,
		validate,
		raw
	};
}

function unregister(command) {
	delete commands[command];
}

function useHelp(description) {
	if (typeof help === 'string') {
		help = description;
	} else {
		help = !!description;
	}
}

function execute(line) {
	console.log(line);
	// parse
	// run command
}

function repl(enabled) {
	if (enabled) {
		// start repl
	} else {
		// stop repl
	}
}

module.exports = {
	register,
	unregister,
	useHelp,
	execute
	// repl
};
