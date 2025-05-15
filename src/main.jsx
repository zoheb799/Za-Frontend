import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <BrowserRouter>
                <App />
                <ToastContainer />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
