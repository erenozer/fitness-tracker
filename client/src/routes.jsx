import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LogIn from "./pages/LogIn.jsx";

export default [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "about",
        element: <div>About</div>,
      },
    ],
  },
];
