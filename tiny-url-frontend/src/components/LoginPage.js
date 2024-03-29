import React from "react";

import { useState, useEffect } from "react";
import styles from './LoginPage.module.css';
import { useNavigate } from "react-router-dom";


const LoginPage  = () => {

  const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem('token'); 

      if(token) {
        navigate('/tinyurl-home');
      }
    }, []);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmiitted] = useState(false);
    const [error, setError] = useState('');
    const [connectionError, setConnectionError] = useState('');

    const isLoggedIn = sessionStorage.getItem('LoggedIn');

    /*useEffect(() => {
      
        const fetchData = async() => {
          //setConnectionError('');
          //setError('');
          if(isSubmitted){
          try{
  
          const response = await fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ "username" : username, "password" : password })
          });
          
          const data = await response.text();

          if(!response.ok){
            throw new Error(data);
          }

          const jwtToken = data;
          sessionStorage.setItem('token', jwtToken);
          sessionStorage.setItem('Connected', true);
          //sessionStorage.setItem('LoggedIn', true);
          //console.log("token is"+sessionStorage.getItem('token'));
          navigate('/tinyurl-home');
          
          setError('');
        }
        catch(error)
        {
          //console.log(error.name);
          //console.log(error.message);
          if (error.name === "TypeError" || error.message === "Failed to fetch") {
            //console.log("inside");
            setConnectionError("Unable to connect to the server. Please try again later.");
            //console.log(connectionError);
        } else {
            // Handle other errors
            setIsSubmiitted(false);
            setError(error.message);
          }
        }
        setIsSubmiitted(false);
      }
    }
    fetchData();
  
    },[isSubmitted]);*/

    const handleSubmit = async(e) =>
    {
        e.preventDefault();
        setIsSubmiitted(true);
          try{
  
          const response = await fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ "username" : username, "password" : password })
          });
          
          const data = await response.text();

          if(!response.ok){
            throw new Error(data);
          }

          const jwtToken = data;
          sessionStorage.setItem('token', jwtToken);
          sessionStorage.setItem('Connected', true);
          //sessionStorage.setItem('LoggedIn', true);
          //console.log("token is"+sessionStorage.getItem('token'));
          navigate('/tinyurl-home');
          
          setError('');
        }
        catch(error)
        {
          //console.log(error.name);
          //console.log(error.message);
          if (error.name === "TypeError" || error.message === "Failed to fetch") {
            //console.log("inside");
            setConnectionError("Unable to connect to the server. Please try again later.");
            //console.log(connectionError);
        } else {
            // Handle other errors
            setIsSubmiitted(false);
            setError(error.message);
          }
        }
        setIsSubmiitted(false);
    }

    const handleSignUpReDirect = () => {
      navigate('/tinyurl-signup');
    }

    return (
      <div className={styles.loginContainer}>
        {connectionError && (<div className={styles.errorMessage}>{connectionError}</div>)}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {!connectionError && (
          <>
            {!isLoggedIn && <h1>Please login to your account</h1>}
            {!isLoggedIn && (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="username" className={styles.label}>Username</label>
                  <input type="text"
                         id="username"
                         className={styles.input}
                         value={username}
                         onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <input type="password"
                         id="password"
                         className={styles.input}
                         value={password}
                         onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className={styles.submitButton}>Log In</button>
                <div>
                  <p>Don't have an account : <span onClick={handleSignUpReDirect} className={styles.signUpLink}>SignUp</span> </p>
              </div>
              </form>
            )}
          </>
        )}
      </div>
    );
}


export default LoginPage;