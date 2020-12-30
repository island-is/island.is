import Link from 'next/link';
import React from 'react';
import { useRouter} from 'next/router';

const ResourcesTabsNav: React.FC = () => {
    const router = useRouter();
    return <nav className="resource-tab-nav">
         <ul>
            <li className="nav__container"><Link href='/resources/api-scopes'><a className={router?.pathname === '/resources/api-scope' ? 'active' : ''}>Api Scopes</a></Link></li>
            <li className="nav__container"><Link href='/resources/api-resources'><a className={router?.pathname.includes('/resources/api-resource') ? 'active' : '' }>Api Resources</a></Link></li>
            <li className="nav__container"><Link href='/resources/identity-resources'><a className={router?.pathname.includes('/resources/identity-resources') ? 'active' : ''}>Identity Resources</a></Link></li>
        </ul>
    </nav>
    
}

export default ResourcesTabsNav;