"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configQuestions = [
    {
        type: 'input',
        name: 'projectKey',
        message: 'Enter projectkey',
        validate: function (value) {
            if (value.length) {
                return true;
            }
            else {
                return 'Please enter a valid projectKey';
            }
        }
    },
    {
        type: 'input',
        name: 'clientId',
        message: 'enter client id',
        validate: function (value) {
            if (value.length) {
                return true;
            }
            else {
                return 'Please enter a valid clientId';
            }
        }
    },
    {
        type: 'input',
        name: 'clientSecret',
        message: 'Enter client Secret',
        validate: function (value) {
            if (value.length) {
                return true;
            }
            else {
                return 'Please enter a valid clientSecret';
            }
        }
    },
    {
        type: 'input',
        name: 'restApiUrl',
        message: 'api url (leave blank for default): ',
        default: 'https://api.sphere.io'
    },
    {
        type: 'input',
        name: 'authUrl',
        message: 'auth url:',
        default: 'https://auth.commercetools.com'
    }
];
