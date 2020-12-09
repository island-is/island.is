import React from 'react';
import Link from 'next/link'

interface Props {
    handleStepChange()
}
const ClientStepNav = () => (
    <nav className="nav">
        <ul>
            <li className="nav__container"><a onClick="">Home</a></Link></li>
            <li className="nav__container"><Link href='/clients'><a>Clients</a></Link></li>
            <li className="nav__container"><Link href='/resources'><a>Resources</a></Link></li>
            <li className="nav__container"><Link href='/users'><a>Users</a></Link></li>
        </ul>
    </nav>
)

export default Nav;