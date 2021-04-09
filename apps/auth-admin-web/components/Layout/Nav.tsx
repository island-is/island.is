/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { isLoggedIn } from '../../utils/auth.utils'
import { useSession } from 'next-auth/client'
import { SessionInfo } from './../../entities/common/SessionInfo'
import { Translation } from './../../entities/common/Translation'
import TranslationUtils from './../../utils/translation.utils'

const Nav: React.FC = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [translation] = useState<Translation>(TranslationUtils.getTranslation())

  if (!isLoggedIn((session as unknown) as SessionInfo, loading)) {
    return <div className="nav-logged-out"></div>
  }

  return (
    <nav className="nav">
      <ul>
        <li className="nav__container">
          <Link href="/">
            <a className={router?.pathname === '/' ? 'active' : ''}>
              {translation.navigations['navigation'].items['home'].text}
            </a>
          </Link>
        </li>
        <li className="nav__container">
          <Link href="/clients">
            <a
              className={
                router?.pathname.includes('client') ||
                router?.pathname === '/client'
                  ? 'active'
                  : ''
              }
            >
              {translation.navigations['navigation'].items['clients'].text}
            </a>
          </Link>
        </li>
        <li className="nav__container">
          <Link href="/resources/api-resources">
            <a
              className={router?.pathname.includes('resource') ? 'active' : ''}
            >
              {translation.navigations['navigation'].items['resources'].text}
            </a>
          </Link>
        </li>
        <li className="nav__container">
          <Link href="/users">
            <a className={router?.pathname === '/users' ? 'active' : ''}>
              {translation.navigations['navigation'].items['users'].text}
            </a>
          </Link>
        </li>
        <li className="nav__container">
          <Link href="/admin">
            <a className={router?.pathname.includes('admin') ? 'active' : ''}>
              {translation.navigations['navigation'].items['admin'].text}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
