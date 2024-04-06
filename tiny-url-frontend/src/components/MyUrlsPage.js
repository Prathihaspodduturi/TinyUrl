import { useState, useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from './MyUrlsPage.module.css';

const MyUrlsPage = () => {
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState('');
    const [connectionError, setConnectionError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          setConnectionError('');
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch("http://localhost:8080/getMyUrls", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const data = await response.text();
                    //console.log(data);
                    throw new Error(data);
                }

                const data = await response.json();
                const urlsData = data.map(url => ({
                    ...url,
                    isEditing: false,
                    editValue: url.originalUrl,
                }));
                setUrls(urlsData);
                //console.log(data);
            } catch (Error) {
              if (Error instanceof TypeError) {
                sessionStorage.clear();
                setConnectionError('Unable to connect to the server. Redirecting to loginpage');
                setTimeout(() => {
                  navigate('/tinyurl-login', { state: { error: "Unable to connect to the server. Please check your connection and try again." } });
              }, 3000);
            } else {
                // Handle other errors
                setError(Error.message);
              }
                //console.log(Error.message);
            }
        }
        fetchData();
    }, []);

    const handleEditChange = (id, value) => {
        setUrls(urls.map(url => url.id === id ? { ...url, editValue: value } : url));
    };

    const editUrl = (id) => {
        setError('');
        setUrls(urls.map(url => url.id === id ? { ...url, isEditing: true } : url));
    };

    const updateUrl = async (id) => {
        
        const updatedUrl = urls.find(url => url.id === id);

        //console.log("updated url is: "+updatedUrl.editValue);
        setError('');
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch("http://localhost:8080/updateurl", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    originalUrl: updatedUrl.editValue,
                })
            });

            if (!response.ok) {
                const data = await response.text();
                //console.log(data);
                throw new Error(data);
            }

            // Optionally fetch the updated list or update locally
            alert("URL Updated Successfully");
            setUrls(urls.map(url => url.id === id ? { ...url, originalUrl: updatedUrl.editValue, isEditing: false } : url));
        } catch (Error) {
          if (Error instanceof TypeError) {
            sessionStorage.clear();
            setConnectionError('Unable to connect to the server. Redirecting to loginpage');
            setTimeout(() => {
              navigate('/tinyurl-login', { state: { error: "Unable to connect to the server. Please check your connection and try again." } });
          }, 1000); 
            }
            setError(Error.message);
            //console.log(Error.message);
        }
    };

    const handleDelete = async (urlId) => {
      try{
            
        const token = sessionStorage.getItem('token');
        const response = await fetch("http://localhost:8080/deleteUrl", {
          method: 'POST',
          headers:  {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id : urlId
        })
        });


        if(!response.ok){
          const data = await response.text();
          //console.log(data);
          throw new Error(data);
        }

        const updatedUrls = urls.filter(url => url.id !== urlId);
        setUrls(updatedUrls);
        alert("URL deleted successfully");
      }
      catch(Error)
      {
        if (Error instanceof TypeError) {
          sessionStorage.clear();
          setConnectionError('Unable to connect to the server. Redirecting to loginpage');
          setTimeout(() => {
            navigate('/tinyurl-login', { state: { error: "Unable to connect to the server. Please check your connection and try again." } });
        }, 1000);
      }
      else
      {
        setError(Error.message);
        //console.log(Error.message);
      }
      }
    };

    const cancelEdit = (id) => {
      // Reset isEditing without changing the editValue
      setError('');
      setUrls(urls.map(url => url.id === id ? { ...url, isEditing: false } : url));
  };

    return (
      <div>
        <div className={styles.topRight}>
        <NavLink to="/tinyurl-logout" className={styles.logoutLink}>
            Logout
          </NavLink>
        </div>
        {!connectionError && (
          <div>
            <h1 className={styles.heading}>Your URLs are:</h1>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <ul className={styles.urlList}>
            {urls.map((url) => (
    <li key={url.id} className={styles.urlItem}>
        {url.isEditing ? (
            <>
                <div className={styles.editContainer}> {/* Wrapper for editing elements */}
                    <span className={styles.editLabel}>Editing Original URL:</span>
                    <input
                        type="text"
                        value={url.editValue}
                        onChange={(e) => handleEditChange(url.id, e.target.value)}
                        className={styles.inputField}
                    />
                    <div className={styles.buttonGroup}> {/* Group buttons together */}
                        <button onClick={() => updateUrl(url.id)} className={styles.editButton}>Save</button>
                        <button onClick={() => cancelEdit(url.id)} className={styles.cancelButton}>Cancel</button>
                    </div>
                </div>
            </>
        ) : (
            <>
                <span className={styles.urlData}>Original: <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>{url.originalUrl}</a></span>
                <span className={styles.urlData}>Shortened: <a href={url.shortenedUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>{url.shortenedUrl}</a></span>
                <button onClick={() => editUrl(url.id)} className={styles.editButton}>Edit</button>
                <button onClick={() => handleDelete(url.id)} className={styles.deleteButton}>Delete</button>
            </>
        )}
    </li>
))}
            </ul>
          </div>
        )}
        {connectionError && <div className={styles.errorMessage}>{connectionError}</div>}
      </div>
    );
}

export default MyUrlsPage;
