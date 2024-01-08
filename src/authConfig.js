/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { InteractionType, LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
    auth: {
        tenantId: 'd124e9f9-8cdd-4d9f-903c-38a26e460ef3', // Tenant
        clientId: 'b672fa84-5fe1-4a0e-b152-92deda24d6d0', // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/d124e9f9-8cdd-4d9f-903c-38a26e460ef3', // Replace the placeholder with your tenant subdomain
        redirectUri: '/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
        postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
    },
    cache: {
        cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            /**
             * Below you can configure MSAL.js logs. For more information, visit:
             * https://docs.microsoft.com/azure/active-directory/develop/msal-logging-js
             */
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const loginRequest = {
    scopes: ['b672fa84-5fe1-4a0e-b152-92deda24d6d0/.default'],
};

export const loginType = InteractionType.Redirect;