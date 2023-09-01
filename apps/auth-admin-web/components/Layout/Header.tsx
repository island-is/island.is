import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { isLoggedIn, login, logout } from '../../utils/auth.utils'
import { SessionInfo } from './../../entities/common/SessionInfo'
import LocalizationUtils from '../../utils/localization.utils'
import { Localization } from '../../entities/common/Localization'

const Header: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )

  useEffect(() => {
    if (!loading && !isLoggedIn(session as unknown as SessionInfo, loading)) {
      if (router) {
        router.push('/')
      }
    }
  }, [session, loading])

  return (
    <header className="header">
      <div className="header__container__logo">
        <h1>{localization.header.title}</h1>
      </div>
      <div className="header__container__options">
        {isLoggedIn(session as unknown as SessionInfo, loading) && (
          <div className="header__container__user">
            <div className="header__username">{session?.user.name}</div>
            <div className="header__container__logout">
              <button
                type="button"
                className="header__button__logout"
                onClick={() => logout(session as unknown as SessionInfo)}
              >
                {localization.header.logoutButton}
              </button>
            </div>
          </div>
        )}
        {!isLoggedIn(session as unknown as SessionInfo, loading) && (
          <div className="header__container__login">
            <button
              type="button"
              className="header__button__login"
              onClick={() => login()}
            >
              {localization.header.loginButton}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
