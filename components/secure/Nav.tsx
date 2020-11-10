import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Nav = () => (
    <nav className="nav">
        <ul>
            <li className="nav__container"><NavLink to={'/main'} className="nav__item" >Forsíða</NavLink></li>
            <li className="nav__container"><NavLink to={'/app'} className="nav__item" >Vefir og smáforrit</NavLink></li>
            <li className="nav__container"><NavLink to={'/resources'} className="nav__item" >Þjónustur</NavLink></li>
            <li className="nav__container"><NavLink to={'/users'} className="nav__item" >Notendur</NavLink></li>
        </ul>
    </nav>
    
)

export default Nav;