/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

const ResourcesTabsNav: React.FC = () => {
  const router = useRouter();
  return (
    <nav className="resource-tab-nav">
      <ul>
        <li
          className={`nav__container ${
            router?.pathname.includes('api-resource') ? 'active' : ''
          }`}
        >
          <Link href="/resources/api-resources">
            <a
              className={
                router?.pathname.includes('api-resource') ? 'active' : ''
              }
            >
              Api Resources
            </a>
          </Link>
        </li>
        <li
          className={`nav__container ${
            router?.pathname.includes('api-scope') ? 'active' : ''
          }`}
        >
          <Link href="/resources/api-scopes">
            <a
              className={router?.pathname.includes('api-scope') ? 'active' : ''}
            >
              Api Scopes
            </a>
          </Link>
        </li>
        <li
          className={`nav__container ${
            router?.pathname.includes('identity-resource') ? 'active' : ''
          }`}
        >
          <Link href="/resources/identity-resources">
            <a
              className={
                router?.pathname.includes('identity-resource') ? 'active' : ''
              }
            >
              Identity Resources
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ResourcesTabsNav;
