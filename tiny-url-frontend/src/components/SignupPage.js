import React, {useState, useEffect} from 'react';
import styles from './SignUpPage.module.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () =>
{

    const navigate = useNavigate();

    useEffect(() => {
      const token = sessionStorage.getItem('token'); 

      if(token) {
        navigate('/tinyurl-home');
      }
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [connectionError, setConnectionError] = useState('');
    const [signUpMessage, setSignUpMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        //setConnectionError('');
        setSignUpMessage('');
        // Perform the signup request
        try {
            const response = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "username": username, "password": password })
            });

            const data = await response.text();

            if (!response.ok) {
                throw new Error(data);
            }
            setUsername('');
            setPassword('');
            setSignUpMessage('signup successfull');
        } catch (error) {
            if (error instanceof TypeError) {
                setConnectionError("Unable to connect to the server. Please try again later.");
            } else {
                // Handle other errors
                //alert('error');
                setPassword('');
                setErrorMessage(error.message);
              }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/tinyurl-login'); 
    };

    return (
        <div className={styles.signUpContainer}>
            {connectionError && (<div className={styles.errorMessage}>{connectionError}</div>)}
            {!connectionError && (
                <div>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSubmit} className={styles.signUpForm}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Username:</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input} />
                        </div>
                        <button type="submit" className={styles.submitButton}>Sign Up</button>
                    </form>
                    <div>
                        <p>Already a user: <span onClick={handleLoginRedirect} className={styles.loginRedirect}>Login</span></p> 
                    </div>
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                    {signUpMessage && <p className={styles.successMessage}>{signUpMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default SignUp;