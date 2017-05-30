#! /usr/bin/env node

const argv = require('yargs').argv;

const commands = {
    login() {
        console.log('Logging in...');
    },

    publish() {
        console.log('Publishing...');
    }
};

const command = argv._[0];
if (commands[command]) {
    commands[command]();
} else {
    console.log('USAGE');
    process.exit(1);
}
