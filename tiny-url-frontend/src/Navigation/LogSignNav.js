import { Link } from "react-router-dom";

const LogSignNav = () =>
{
    return (<div>
        <h1><Link to="/login">Click here</Link> to sign in to your account</h1>
        <h1><Link to="/signup">Click here</Link> to create an account</h1>
    </div>);
}

export default LogSignNav;