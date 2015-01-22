# TiCh

Allows you to switch TiApp.xml configurations via the CLI


## Install [![NPM version](https://badge.fury.io/js/tich.svg)](http://badge.fury.io/js/tich)

As global CLI:

    $ npm install -g tich

## Usage

### CLI

Create a tich.cfg file in the Titanium project folder as follows:-

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

You can currently put any top level XML node in the settings object, so *publisher*, *copyright*, *icon* etc
    
##Switch configuration

    $ tich use app1
    $ tich use app2
    

### Changelog

* 0.0.7: remove redundant dependencies
* 0.0.6: Updates to package and check for updates
* 0.0.5: Initial version