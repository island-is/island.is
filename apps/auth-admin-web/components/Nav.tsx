import React from 'react';
import Link from 'next/link'

const Nav = () => (
    <nav className="nav">
        <ul>
            <li className="nav__container"><Link href='/'><a>Home</a></Link></li>
            <li className="nav__container"><Link href='/clients'><a>Clients</a></Link></li>
            <li className="nav__container"><Link href='/resources'><a>Resources</a></Link></li>
            <li className="nav__container"><Link href='/users'><a>Users</a></Link></li>
        </ul>
    </nav>
)

export default Nav;