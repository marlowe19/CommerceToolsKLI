
export const configQuestions: object[] = [
    {
        type: "input",
        name: "projectKey",
        message: "Enter projectkey",
        validate( value ) {
            if (value.length) {
                return true;
            } else {
                return "Please enter a valid projectKey";
            }
        },
    },
    {
        type: "input",
        name: "clientId",
        message: "enter client id",
        validate( value ) {
            if (value.length) {
                return true;
            } else {
                return "Please enter a valid clientId";
            }
        },
    },
    {
        type: "input",
        name: "clientSecret",
        message: "Enter client Secret",
        validate( value ) {
            if (value.length) {
                return true;
            } else {
                return "Please enter a valid clientSecret";
            }
        },
    },
    {
        type: "input",
        name: "restApiUrl",
        message: "api url (leave blank for default): ",
        default: "https://api.sphere.io",
    },

    {
        type: "input",
        name: "authUrl",
        message: "auth url:",
        default: "https://auth.commercetools.com",
    },
];

export const confirmation = (total, name) => {

    return  [
        {
            type: "confirm",
            name,
            message: `You are about to delete ${total} product(s)`,
            validate( value ) {
                if (value) {
                    return true;
                } else {
                    return "Please confirm";
                }
            },
        },
    ];
};
