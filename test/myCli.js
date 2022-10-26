const { CLI } = require('..');

const myCli = new CLI([{
	name: 'hello-world',
	exec: () => console.log('Hello world!'),
	description: 'Says hello world!'
}]);

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
