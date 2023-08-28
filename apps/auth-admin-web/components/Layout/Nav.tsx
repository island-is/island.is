/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { isLoggedIn } from '../../utils/auth.utils'
import { useSession } from 'next-auth/client'
import { SessionInfo } from './../../entities/common/SessionInfo'
import { Localization } from '../../entities/common/Localization'
import LocalizationUtils from '../../utils/localization.utils'
import { RoleUtils } from './../../utils/role.utils'

const Nav: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    async function resolveRoles() {
      const response = await RoleUtils.isUserAdmin()
      setIsAdmin(response)
    }

    resolveRoles()
  }, [])

  if (!isLoggedIn(session as unknown as SessionInfo, loading)) {
    return <div className="nav-logged-out"></div>
  }

  const adminRoute = () => {
    if (isAdmin) {
      return (
        <li className={`nav__container ${isAdmin ? 'hide' : 'show'}`}>
          <Link
            href="/admin"
            className={router?.pathname.includes('admin') ? 'active' : ''}
          >
            {localization.navigations['navigation'].items['admin'].text}
          </Link>
        </li>
      )
    }
  }

  return (
    <nav className="nav">
      <ul>
        <li className="nav__container">
          <Link href="/" className={router?.pathname === '/' ? 'active' : ''}>
            {localization.navigations['navigation'].items['home'].text}
          </Link>
        </li>
        <li className="nav__container">
          <Link
            href="/clients"
            className={
              router?.pathname.includes('client') ||
              router?.pathname === '/client'
                ? 'active'
                : ''
            }
          >
            {localization.navigations['navigation'].items['clients'].text}
          </Link>
        </li>
        <li className="nav__container">
          <Link
            href="/resources/api-resources"
            className={router?.pathname.includes('resource') ? 'active' : ''}
          >
            {localization.navigations['navigation'].items['resources'].text}
          </Link>
        </li>

        {adminRoute()}
      </ul>
    </nav>
  )
}

export default Nav
