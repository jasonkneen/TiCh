#!/usr/bin/env node

var program = require('commander'),
    chalk = require('chalk'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    tiappxml = require('tiapp.xml'),
    pkg = require('../package.json')

// check if the TiApp.xml an TiCh config file exists
if (!fs.existsSync('tiapp.xml')) {
    console.log(chalk.red('Please run in the Ti Project folder'));
} else if (!fs.existsSync('tich.cfg')) {
    console.log(chalk.red('No tich config!'));
} else {
    tich();
}

// main function
function tich() {

    // status command, shows the current config
    function status() {
        console.log('\n');
        console.log('Name: ' + chalk.cyan(tiapp.name));
        console.log('AppId: ' + chalk.cyan(tiapp.id));
        console.log('Version: ' + chalk.cyan(tiapp.version));
        console.log('GUID: ' + chalk.cyan(tiapp.guid));
        console.log('\n');
    }

    // select a new config by name
    function select(name) {

        if (!name) {
            if (fs.existsSync('./app/config.json')) {
                var alloyCfg = JSON.parse(fs.readFileSync("./app/config.json", "utf-8"));

                if (alloyCfg.global.theme) {
                    console.log('\nFound a theme in config.json, trying ' + chalk.cyan(alloyCfg.global.theme));
                    select(alloyCfg.global.theme);
                } else {
                    status();
                }
            }
        } else {

            // find the config name specified
            cfg.configs.forEach(function(config) {

                if (config.name === name) {
                    console.log('\nFound a config for ' + chalk.cyan(config.name) + '\n');

                    for (var setting in config.settings) {

                        if (setting != "properties") {

                            tiapp[setting] = config.settings[setting];

                            console.log('Changing ' + chalk.cyan(setting) + ' to ' + chalk.yellow(config.settings[setting]))
                        }

                    }



                    if (config.settings.properties) {
                        for (var property in config.settings.properties) {

                            tiapp.setProperty(property, config.settings.properties[property]);

                            console.log('Changing App property ' + chalk.cyan(property) + ' to ' + chalk.yellow(config.settings.properties[property]))

                        }
                    }

                    console.log(chalk.green('\nTiApp.xml updated\n'));

                    tiapp.write();

                }
            });
            
            //console.log(chalk.red('\nCouldn\'t find a config called: ' + name + '\n'));
        
        }
    }

    // read in our config
    var cfg = JSON.parse(fs.readFileSync("tich.cfg", "utf-8"));

    // read in the app config
    var tiapp = tiappxml.load('./tiapp.xml');

    // setup CLI
    program
        .version(pkg.version, '-v, --version')
        .usage('[options]')
        .description(pkg.description)
        .option('-l, --list', 'Lists the configurations in the project folder')
        .option('-s, --select <name>', 'Updates TiApp.xml to config specified by <name>')
        //.option('-c, --capture <name>', "Stores the current values of TiApp.xml id, name, version as <name> ")

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    // LIST command - show the list of config items
    if (program.list) {
        cfg.configs.forEach(function(config) {
            console.log(chalk.cyan(config.name + ' - ' + chalk.grey('Name: ') + config.settings.name + ' ' + chalk.grey('Id: ') + config.settings.id + ' ' + chalk.grey('Version: ') + config.settings.version));
        });

    // select command, select based on the arg passed
    } else if (program.select) {

        select(program.args[0]);

    // capture command - this will store the current TiApp.xml settings
    } else if (program.capture) {
        // coming soon!

    } else {

        status();

    }

}
