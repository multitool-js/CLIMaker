# Multitool JS / CLI Maker
Creator for CLI apps.

To create a new CLI you can just run:
``` js
    const { CLI } = require('@multitool-js/climaker');

    const myCli = new CLI([
        //commands
    ],{
        // options
    });
```
### Options
Option | Description |  Default
------ | ----------- |  :-----:
base | Path/command of the app, is visible in the description | `node ${path.relative(process.cwd(), process.argv[1])}`
throwOnMissingFlag | Throws an error before command execution if a *required* flag is missing | `true`
throwOnMissingParam | Throws an error before command execution if a *required* parameter is missing | `true`
throwOnUnknownFlag | Throws an error before command execution if a non-specified flag is found | `false`
throwOnUnexpectedTokens | Throws an error before command execution if there are any non-parsed tokens left in the arguments | `false`
passthrough | When true, remaining tokens are passed to the *exec* function under *__args*, pass a *string* to define the variable name | `false`
helpFlag | Defines a flag to invoke the help output of a command. You can pass either `true` to use the default *--help* and *-h* or an object like `{ name: "help", shorthand: "h" }`, *shorthand* is optional | `true`

### Commands
Each command has the following properties:
Property | Type | Description | Required | Default
-------- | :--: | ----------- | :------: | :-----:
name | `string` | Name of the command | Yes |
exec | `function` | Execution function, is called when the command is selected. Accepts the parsed flags and parameters as argument. | Yes |
alias | `string`&#124;`string[]` | List of possible aliases for the command | No |
description | `string` | Command description to show on help | No |
extendedDescription | `string` | Additional description to show on command-specific help | No |
flags | `[]` | List of flags to parse | No |
params | `[]` | List of parameters to parse | No |
throwOnMissingFlag | `boolean` | As in *options*, when set overrides the parent value | No | `true`
throwOnMissingParam | `boolean` | As in *options*, when set overrides the parent value | No | `true`
throwOnUnknownFlag | `boolean` | As in *options*, when set overrides the parent value | No | `false`
throwOnUnexpectedTokens | `boolean` | As in *options*, when set overrides the parent value | No | `false`
passthrough | `string`&#124;`boolean` | As in *options*, when set overrides the parent value | No | `false`

## Flags
Each flag has the *--name* structure. Shorthands use a single letter *-c*  
Different types of flags exist:
Type | Example | Description | Output
---- | :-----: | ----------- | :----:
bool | --test, -t | Boolean flag, if present the output is `true`, `false` otherwise | `boolean`
value | --foo=bar, -f=bar, --foo bar, -f bar | Value flag, can be written with or without =, reads the value and outputs it, only consumes the first occurrence of the flag | `string`
multivalue | --foo=bar --foo=baz | Like the *value* type, but can be set multiple times, the output is an array of all the occurrences | `string[]`

### Options
Each flag has the following properties:
Property | Type | Description | Required | Default
-------- | :--: | ----------- | :------: | :-----:
name | `string` | Name of the flag | Yes |
shorthand | `string` | Shorthand name of the flag | No |
type | `'bool'`&#124;`'value'`&#124;`'multivalue'` | | No | `'bool'`
description | `string` | Description of the flag, used in the help | No |
variableName | `string` | Name of the variable passed to the command execution function. Defaults to the flag name. | No | *name*
required | `boolean` | If `true` an error is thrown if the flag is missing | No | `false`

## Params
### Options
Each parameter has the following properties:
Property | Type | Description | Required | Default
-------- | :--: | ----------- | :------: | :-----:
name | `string` | Name of the flag | Yes |
description | `string` | Description of the flag, used in the help | No |
variableName | `string` | Name of the variable passed to the command execution function. Defaults to the flag name. | No | *name*
required | `boolean` | If `true` an error is thrown if the flag is missing | No | `false`

## Default CLI
For convenience, a default cli instance is available as *cli*:
``` js
    const { cli } = require('@multitool-js/climaker');
```
To register new commands use the *register* method:
``` js
    cli.register({
        // command options
    })
```
To change settings you can set the corrisponding variable:
``` js
    cli.helpFlag = {
        name: "help-me",
        shorthand: "H"
    }
```

## Examples
### Create a new CLI with the command "hello-world"
``` js
    const { CLI } = require('@multitool-js/climaker');

    const myCli = new CLI([{
        name: "hello-world",
        exec: () => console.log('Hello world!'),
        description: "Says hello world!"
    }]);

    myCli.execute();
```
Assuming the CLI is defined in the myCli.js file:
```
$ node myCli.js help
$ Available commands:
$
$ hello-world:
$   Says hello world!
```
```
$ node myCli.js hello-world
$ Hello world!
```
### Following the above exxample, register a new command hello with a parameter.  
**NOTE:** always ensure to replace register new commands before invoking the *execute* method.
``` js
    myCli.register({
        name: 'hello',
        exec: ({ target, happy, uppercase }) => {
            let text = `Hello ${target}!`;
            if (happy) text += ' :)';
            if (uppercase) text = text.toUpperCase();
            console.log(text);
        },
        description: 'Says hello to someone!',
        params: [{
            name: 'target',
            required: true
        }],
        flags: [{
            name: 'happy',
            shorthand: 'H'
        }, {
            name: 'uppercase'
        }]
    });
    
    myCli.execute();
```
```
$ node myCli.js help
$ Available commands:
$ 
$ hello-world:
$   Says hello world!
$ 
$ hello:
$   Says hello to someone!
```
```
$ node myCli.js hello universe -H
$ HELLO UNIVERSE! :)
```
