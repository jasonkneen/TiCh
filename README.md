# TiCh

Allows you to switch TiApp.xml configurations via the CLI

## Why?

Titanium + Alloy has the ability to theme apps, which is awesome when it comes to having multiple versions of apps that share the same codebase. You can have different styles (TSS), views (XML), app icons, splash screens and assets per theme. The problem is that TiApp.xml is never-changing. Which means if you want to have one codebase but multiple instances of branded apps (all with their own names, versions, App IDs etc) it's a nightmare to manage. 

The only solution is to have multiple TiApp.xml files OR manage this manually, storing the values you need to remember for each app. It's multiplied if you build for multiple platforms because Android doesn't allow certain characters in the app id so if you've already published the iOS version, then go to publish Android, you have a problem.

TiCh was designed for me, to solve this issue with a client where I will have one codebase, multiple apps and varying app Ids. It allows me to switch apps, I then clean the project, and build the new version.

There are issues - for one you have to document this in your app for others to know - it's also not git friendly as you'll be polluting your TiApp.xml each time and changing it's content. 

But it's a solution (for now) until Appcelerator solve this in some way.

## Install [![NPM version](https://badge.fury.io/js/tich.svg)](http://badge.fury.io/js/tich)

As global CLI:

    $ npm install -g tich

## Usage

### CLI

Create a tich.cfg file in the Titanium project folder as follows:-
```json
{
    "configs": [{
        "name": "app1",
        "settings": {
            "name": "APP1",
            "version": "1.0.0",
            "id": "com.domain.app1"
        }
    }, {
        "name": "test",
        "settings": {
            "name": "APP2",
            "version": "2.0.0",
            "id": "com.domain.app2"
        }
    }]
}
```
You can currently put any top level XML node in the settings object, so *publisher*, *copyright*, *icon* etc

##Status

This will show the current TiApp.xml config for name, id, version:

    $ tich    

##Switch configuration

This will switch the current TiApp.xml file to the settings for the config name specified:

    $ tich select app1
    $ tich select app2
    
You'll need to do a 

    $ ti clean
    
too before building with Titanium as any App Name changes will create multiple projects.

##Future thoughts

* allow saving of new config items / settings via the CLI
* allow renaming, deleting of configs
* allow postbuild commands using Ti/TiNy (ti appstore) to be passed or put into config
* improve error handling
* allow backup capbility to save changed TiApp.xml files
    

### Changelog

* 0.0.8: changed 'use' to 'select', added status / default
* 0.0.7: remove redundant dependencies
* 0.0.6: Updates to package and check for updates
* 0.0.5: Initial version

##  Thanks

* [Tony Luka Savage](http://github.com/tonylukasavage) for creating the Tiapp.xml module
* [Fokke Zandbergen](http://github.com/fokkeZB) for the CLI template
