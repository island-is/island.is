import React from 'react';
import Link from 'next/link'
import { useRouter} from 'next/router';

const Nav = () => {
    const router = useRouter();
    return (<nav className="nav">
        <ul>
            <li className="nav__container"><Link href='/'><a className={router?.pathname === '/' ? 'active' : ''}>Home</a></Link></li>
            <li className="nav__container"><Link href='/clients'><a className={router?.pathname === '/clients' || router?.pathname === '/client' ? 'active' : ''}>Clients</a></Link></li>
            <li className="nav__container"><Link href='/resources'><a className={router?.pathname.includes('resource') ? 'active' : ''}>Resources</a></Link></li>
            <li className="nav__container"><Link href='/users'><a className={router?.pathname === '/users' ? 'active' : ''}>Users</a></Link></li>
        </ul>
    </nav>
)}

export default Nav;