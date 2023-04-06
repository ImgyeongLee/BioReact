import {NavLink} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="home">
                <NavLink to="/main">BIOREACTOR</NavLink>
            </div>
            <div className="nav-container">
                <div className="general-nav">
                    <NavLink to="/about">About</NavLink>
                </div>
                <div className="general-nav">
                    <NavLink to="/main">Main</NavLink>
                </div>
                <div className="general-nav">
                    <NavLink to="/manual">Manual</NavLink>
                </div>
                <div className="general-nav">
                    <NavLink to="/recipes">Recipes</NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
