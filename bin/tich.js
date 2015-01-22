#!/usr/bin/env node

var program = require('commander'),
    chalk = require('chalk'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    tiappxml = require('tiapp.xml'),
    pkg = require('../package.json')

if (!fs.existsSync('tiapp.xml')) {
    console.log(chalk.red('Please run in the Ti Project folder'));
} else if (!fs.existsSync('tich.cfg')) {
    console.log(chalk.red('No tich config!'));
} else {
    tich();
}

function tich() {

    var cfg = JSON.parse(fs.readFileSync("tich.cfg", "utf-8"));

    var tiapp = tiappxml.load('./tiapp.xml');

    program
        .version(pkg.version, '-v, --version')
        .usage('[options]')
        .description(pkg.description)
        .option('-l, --list', 'Lists the configurations in the project folder')
        .option('-s, --select <name>', 'Switches the TiApp.xml to use the config settings specified by <name>')

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    if (program.list) {
        cfg.configs.forEach(function(config) {
            console.log(chalk.cyan(config.name + ' - ' + chalk.grey('Name: ') + config.settings.name + ' ' + chalk.grey('Id: ') + config.settings.id + ' ' + chalk.grey('Version: ') + config.settings.version));
        });
    } else if (program.select) {

        // find the config
        cfg.configs.forEach(function(config) {

            if (config.name === program.args[0]) {
                console.log('\nFound a config for ' + chalk.cyan(config.name) + '\n');
                for (var prop in config.settings) {

                    tiapp[prop] = config.settings[prop];

                    console.log('Changing ' + chalk.cyan(prop) + ' to ' + chalk.yellow(config.settings[prop]))

                }

                console.log(chalk.green('\nTiApp.xml updated\n'));

                tiapp.write();

            }
        });
    } else {
        console.log('\n');
        console.log('Name: ' + chalk.cyan(tiapp.name));
        console.log('AppId: ' + chalk.cyan(tiapp.id));
        console.log('Version: ' + chalk.cyan(tiapp.version));
        console.log('\n');
    }

}
