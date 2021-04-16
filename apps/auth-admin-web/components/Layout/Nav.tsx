/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { isLoggedIn } from '../../utils/auth.utils'
import { useSession } from 'next-auth/client'
import { SessionInfo } from './../../entities/common/SessionInfo'
import { Localization } from '../../entities/common/Localization'
import LocalizationUtils from '../../utils/localization.utils'
import { UserInfoService } from './../../services/UserInfoService'

const Nav: React.FC = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    UserInfoService.getUserInfo().then((userInfo) => {
      if (userInfo.nationalId === '3004764579') {
        setIsAdmin(true)
      }
    })
  }, [])

  if (!isLoggedIn((session as unknown) as SessionInfo, loading)) {
    return <div className="nav-logged-out"></div>
  }

  const adminRoute = () => {
    if (isAdmin) {
      return (
        <li className={`nav__container ${isAdmin ? 'hide' : 'show'}`}>
          <Link href="/admin">
            <a className={router?.pathname.includes('admin') ? 'active' : ''}>
              {localization.navigations['navigation'].items['admin'].text}
            </a>
          </Link>
        </li>
      )
    }
  }

  return (
    <nav className="nav">
      <ul>
        <li className="nav__container">
          <Link href="/">
            <a className={router?.pathname === '/' ? 'active' : ''}>
              {localization.navigations['navigation'].items['home'].text}
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
              {localization.navigations['navigation'].items['clients'].text}
            </a>
          </Link>
        </li>
        <li className="nav__container">
          <Link href="/resources/api-resources">
            <a
              className={router?.pathname.includes('resource') ? 'active' : ''}
            >
              {localization.navigations['navigation'].items['resources'].text}
            </a>
          </Link>
        </li>
        <li className="nav__container">
          <Link href="/users">
            <a className={router?.pathname === '/users' ? 'active' : ''}>
              {localization.navigations['navigation'].items['users'].text}
            </a>
          </Link>
        </li>
        {adminRoute()}
      </ul>
    </nav>
  )
}

export default Nav
