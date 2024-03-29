import React, {useState, useEffect}  from "react";
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import styles from "./HomePage.module.css";

const TinyUrlHomePage = () => {

  const [initialConnection, setConnection] = useState(false);
  const [error,setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlExistsError, setUrlExistsError] = useState('');

  const [isToken, setIsToken] = useState(false);

  const LoggedIn = sessionStorage.getItem('LoggedIn');

    useEffect(() => {
      const token = sessionStorage.getItem('token'); 

      if(token) {
        setIsToken(true); 
      }
    }, []);

    useEffect(() => {

      const fetchConnection = async() => {
        setConnectionError('');
        setError('');
        try{

          if(initialConnection === true)
          {
            console.log("true");
            return;
          }

          //console.log("connecting");

        const response = await fetch("http://localhost:8080/");
        if(!response.ok){
          throw new Error(`Could not connect. Try again later`);
        }

        const data = await response.text();
        setFlag(true);
        setConnection(true);
        sessionStorage.setItem("Connected", "true");
        setConnection(initialConnection);
        
      }
      catch(Error)
      {
          setConnectionError("Unable to connect to server. Please Try again later!");
      }
      finally {
        setLoading(false); // Ensure loading is set to false after the check
      }
    };
  
    if(!initialConnection){
      const timerId = setTimeout(fetchConnection, 150);
      return () => clearTimeout(timerId);
    }
    else
    {
      setFlag(true);
    }
  },[initialConnection]);
  
  
    

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShortUrl('');
        setConnectionError('');
        //setError('');
        //setError('');
        try
        {
            const token = sessionStorage.getItem('token');
            const response = await fetch("http://localhost:8080/saveUrl",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({"originalUrl": url})
            });

          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
          const data = await response.text();
          setError('');
          setShortUrl(data);
          //console.log("receieved data is " + data);

          setUrl('');
        } catch (error) {
          if (error instanceof TypeError) {
            sessionStorage.clear();
            setConnectionError('Unable to connect to the server. Click on refresh to redirect to loginpage');
            navigate('/tinyurl-home', { state: { error: "Unable to connect to the server. Please check your connection and try again." } });
          }
          else {
            setError(error.message);
          }
        }
      }

      if (loading) {
        return <div className={styles.content}>Loading...</div>; // Show a loading state while checking the connection
      }

    // Check for connection error first
  if (connectionError) {
    return (
      <div className={styles.errorMessage}>{connectionError}</div>
    );
  }

  return (
    <div className={styles.App}>
      <div className={styles.navContainer}>
        {isToken && (
          <>
            <NavLink to="/tinyurl-myurls" className={`${styles.navLink} ${styles.myUrlsLink}`}>My URLs</NavLink>
            <NavLink to="/tinyurl-logout" className={styles.navLink} onClick={() => {sessionStorage.removeItem('token'); setIsToken(false);}}>Logout</NavLink>
          </>
        ) 
        }
      </div>
      <div className={styles.content}>
        <h1>Welcome to My Tiny URL</h1>
        <p>A simple site to shorten your URL</p>

        {isToken && (
          <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="url" className={styles.label}>Enter The Original URL:</label>
          <input
            type="text"
            id="url"
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
        )}
        {shortUrl && (
          <div className={styles.shortUrlContainer}>
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className={styles.shortUrlLink}>
          {shortUrl}
          </a>
          </div>
        )}
        {error && (<div className={styles.errorMessage}>{error}</div>)}
        {!isToken && (
          <div className={styles.authLinksContainer}>
            <p>Please log in or sign up to use the URL shortening service.</p>
          </div>
        )}
        {!isToken && (
        <div className={styles.authPrompt}>
          <NavLink to="/tinyurl-login" className={styles.button}>Login</NavLink>
          <NavLink to="/tinyurl-signup" className={styles.button}>Sign Up</NavLink>
        </div>
        )}
      </div>
    </div>
  );
  
}

export default TinyUrlHomePage;