import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Provider,
} from "react-redux";

import "./index.css";

import App from "./App.jsx";

import Providers from "./app/providers.jsx";

import { store } from "./store/store.js";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <Provider store={store}>

      <Providers>

        <BrowserRouter>

          <App />

        </BrowserRouter>

      </Providers>

    </Provider>

  </React.StrictMode>
);