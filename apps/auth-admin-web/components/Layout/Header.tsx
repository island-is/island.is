import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { isLoggedIn, login, logout } from '../../utils/auth.utils'
import { SessionInfo } from './../../entities/common/SessionInfo'
import { LOCALE_KEY } from './../../i18n/locales'
import TranslationUtils from './../../utils/translation.utils'
import { Translation } from './../../entities/common/Translation'

const Header: React.FC = () => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [translation] = useState<Translation>(TranslationUtils.getTranslation())

  useEffect(() => {
    if (!isLoggedIn((session as unknown) as SessionInfo, loading)) {
      if (router) {
        router.push('/')
      }
    }
  }, [session, loading])

  return (
    <header className="header">
      <div className="header__container__logo">
        <h1>{translation.header.title}</h1>
      </div>
      <div className="header__container__options">
        {isLoggedIn((session as unknown) as SessionInfo, loading) && (
          <div className="header__container__user">
            <div className="header__username">{session?.user.name}</div>
            <div className="header__container__logout">
              <button
                type="button"
                className="header__button__logout"
                onClick={() => logout((session as unknown) as SessionInfo)}
              >
                {translation.header.logoutButton}
              </button>
            </div>
          </div>
        )}
        {!isLoggedIn((session as unknown) as SessionInfo, loading) && (
          <div className="header__container__login">
            <button
              type="button"
              className="header__button__login"
              onClick={() => login()}
            >
              {translation.header.loginButton}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
