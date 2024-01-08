import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";
import { HttpServices } from "./httpService";
import { UrlService } from "./urlService";
import { Navigate } from "react-router-dom";
import Enum, { StorageKeys } from "../helpers/constants";
import { SessionStorage } from "../helpers/storage";

const msalInstance = new PublicClientApplication(msalConfig);

const init = () => {   
    setActiveAccount();
    eventCallback();
    return msalInstance;
};

function loginRedirect() {
    try {
        msalInstance.loginRedirect(msalConfig.loginRequest);
    } 
    catch (err) {
        console.log(err);
    }
};

function setActiveAccount() {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length == 1) {
        const account = accounts[0];
        if (account?.tenantId === msalConfig.auth.tenantId) {
            msalInstance.setActiveAccount(account);
        }
    } 
    else if (accounts.length > 1) {
        accounts.forEach((account) => {
            if (account?.tenantId === msalConfig.auth.tenantId) {
            msalInstance.setActiveAccount(account);
            }
        });
    }
}; 

async function getToken() {
  try {
    const account = msalInstance.getActiveAccount();
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: account,
      scopes: msalConfig.loginRequest,
    });
    if(tokenResponse)
      return tokenResponse?.accessToken;
  } catch (error) {
    console.error('Token Error:', error);
  }
}

function getUserInfo(emailId){
  let url = UrlService.getUserInfo;
  url = url.replace('#emailId#', emailId);
  HttpServices.Get(url)
    .then((result) => result.data)
    .then((response) => {
        if (response.status && response.data) {
            let userInfo = JSON.parse(response.data);
            SessionStorage.setItem(StorageKeys.userInfo , JSON.stringify(userInfo));
            window.location.href = "/";
        }
        else window.location.href = "/access-denied?message=Invalid username or password. Please try again.&signIn=true";
    }).catch((error) => {
        console.log(error);
    });
}

function eventCallback() {
    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload;
        const account = payload.account;
        msalInstance.setActiveAccount(account);
        setTimeout(()=>{
          getUserInfo(account.username);
        });
      } else if(event.eventType === EventType.LOGIN_FAILURE
        || event.eventType === EventType.SSO_SILENT_FAILURE
        || event.eventType === EventType.ACQUIRE_TOKEN_FAILURE
        || event.eventType === EventType.ACQUIRE_TOKEN_BY_CODE_FAILURE
        || event.eventType === EventType.LOGOUT_FAILURE) {
        console.log(event.error);
        console.log("Azure EventCallback: ", event);
      }
    });
}

export const AuthService = {
    Init: init,
    LoginRedirect: loginRedirect,
    GetToken: getToken
}