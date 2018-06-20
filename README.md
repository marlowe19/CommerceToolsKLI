# Commerce Tools CLI ![Build Status](https://travis-ci.org/marlowe19/CommerceToolsKLI.svg?branch=master)
CLI for the commerce tools APIs

This is the unoffical Commerce Tools Command Line Interface(CLI) to make working with products easier and faster.

* get information about products like prices/sku without recieving the entire json
* unpublish products by id
* unpublish all products by productTypes
* delete products by id 
* delete all products by Productypes
* get all productTypes


To get started with the Commerce tools CLI, read the full list of commands below.

## Installation

To install Commerce tools cli you need to install [Node.js](http://nodejs.org/) first.

Once node and npm is installed get the Commece tools CLI by running:

```bash
npm install -g commercetoolscli
```

This will provide you with the globally accessible `commercetools` command.

## Commands
The command `commercetools --help` lists the available commands and `commercetools <command> --help` shows more details for an individual command.

Below is a brief list of the available commands and their function:

Command | Description
------- | -----------
**config** | prompt an sequence of questions to authenticate to your commercetools project
**products** | append `<id>` to get same for all product attributes.
**publish** | append `<id>` to unpublish a product by their id.
**help** | Display help information about the CLI or specific commands.
