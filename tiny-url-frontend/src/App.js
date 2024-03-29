import logo from './logo.svg';
import './App.css';
import TinyUrlHomePage from './components/TinyUrlHomePage';
import { Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';

import React, {useState, useEffect}  from "react";
import LoginPage from './components/LoginPage';
import SignUp from './components/SignupPage';
import LogOut from './components/Logout';
import MyUrlsPage from './components/MyUrlsPage';

const router = createBrowserRouter([
      {
        path: '/',
        element: <Navigate to="/tinyurl-home" replace />,
      },
      {
        path: '/tinyurl-home',
        element: <TinyUrlHomePage/>,
      },
      {
        path: '/tinyurl-login',
        element: <LoginPage/>
      },
      {
        path: '/tinyurl-signup',
        element: <SignUp/>
      },
      {
        path: '/tinyurl-logout',
        element: <LogOut/>
      },
      {
        path: '/tinyurl-myurls',
        element: <MyUrlsPage/>
      }
])

function App() {

  return <RouterProvider router={router} />;
}

export default App;
