import React, { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { isLoggedIn, login, logout } from '../../utils/auth.utils'
import { SessionInfo } from './../../entities/common/SessionInfo'

const Header: React.FC = () => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    console.info('Header - useEffect - ', session?.refreshToken)
    if (!isLoggedIn((session as unknown) as SessionInfo, loading)) {
      console.info('Header - useEffect - !isLoggedIn -', session?.refreshToken)

      if (router) {
        router.push('/')
      }
    }
  }, [session, loading])

  return (
    <header className="header">
      <div className="header__container__logo">
        <h1>IDS management</h1>
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
                Logout
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
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
