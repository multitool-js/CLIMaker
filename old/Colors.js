const ESCAPE = '\x1b[';

const codes = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',

	fgBlack: '\x1b[30m',
	fgRed: '\x1b[31m',
	fgGreen: '\x1b[32m',
	fgYellow: '\x1b[33m',
	fgBlue: '\x1b[34m',
	fgMagenta: '\x1b[35m',
	fgCyan: '\x1b[36m',
	fgWhite: '\x1b[37m',
	fgReset: '\x1b[39m',

	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m',
	bgReset: '\x1b[49m'
};

function apply(string, color, reset = codes.reset) {
	return `${color}${string}${reset}`;
}

function fg8bit(string, color = 15) {
	return apply(string, `${ESCAPE}38:5:${color}m`);
}

function fg24bit(string, { r = 255, g = 255, b = 255 } = {}) {
	return apply(string, `${ESCAPE}38;2;${r};${g};${b}m`);
}

function bg8bit(string, color = 15) {
	return apply(string, `${ESCAPE}48:5:${color}m`);
}

function bg24bit(string, { r = 255, g = 255, b = 255 } = {}) {
	return apply(string, `${ESCAPE}48;2;${r};${g};${b}m`);
}

module.exports = {
	codes,

	bright: (string) => apply(string, codes.bright),
	dim: (string) => apply(string, codes.dim),
	underscore: (string) => apply(string, codes.underscore),
	blink: (string) => apply(string, codes.blink),
	reverse: (string) => apply(string, codes.reverse),
	hidden: (string) => apply(string, codes.hidden),

	black: (string) => apply(string, codes.fgBlack, codes.fgReset),
	red: (string) => apply(string, codes.fgRed, codes.fgReset),
	green: (string) => apply(string, codes.fgGreen, codes.fgReset),
	yellow: (string) => apply(string, codes.fgYellow, codes.fgReset),
	magenta: (string) => apply(string, codes.fgMagenta, codes.fgReset),
	cyan: (string) => apply(string, codes.fgCyan, codes.fgReset),
	white: (string) => apply(string, codes.fgWhite, codes.fgReset),

	bgBlack: (string) => apply(string, codes.bgBlack, codes.bgReset),
	bgRed: (string) => apply(string, codes.bgRed, codes.bgReset),
	bgGreen: (string) => apply(string, codes.bgGreen, codes.bgReset),
	bgYellow: (string) => apply(string, codes.bgYellow, codes.bgReset),
	bgMagenta: (string) => apply(string, codes.bgMagenta, codes.bgReset),
	bgCyan: (string) => apply(string, codes.bgCyan, codes.bgReset),
	bgWhite: (string) => apply(string, codes.bgWhite, codes.bgReset),

	fg8bit,
	fg24bit,

	bg8bit,
	bg24bit
};
