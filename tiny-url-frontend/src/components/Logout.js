import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => 
{
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();

        setTimeout(() => navigate('/tinyurl-home'), 1000);
    }, [navigate]);

    return (
        <h1>Logging out</h1>
    );
}

export default LogOut;