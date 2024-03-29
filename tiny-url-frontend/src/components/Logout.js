import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => 
{
    const navigate = useNavigate();

    //const [isloggingOut, setIsLoggingOut] = useState('');

    useEffect(() => {
        sessionStorage.clear();
        //setIsLoggingOut(true);
        const timeoutId = setTimeout(() => navigate('/tinyurl-home'), 1000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [navigate]);

    return (
        <h1>Logging out</h1>
    );
}

export default LogOut;