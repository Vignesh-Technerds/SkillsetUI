import Router from "./components/router/route";
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from '../src/assets/theme';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css"; // Specify weight and style
import { ToasterProvider } from "./components/toaster/toasterContext";
import { LoaderProvider } from "./components/loader/loaderContext";
import { MsalProvider } from "@azure/msal-react";

function App({instance}) {
  return (
    <MsalProvider instance={instance}>
      <ThemeProvider>
        <ToasterProvider>
          <LoaderProvider>
            <BrowserRouter >
              <Router />
            </BrowserRouter>
          </LoaderProvider>
        </ToasterProvider>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
