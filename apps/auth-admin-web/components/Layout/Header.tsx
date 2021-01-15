import React, { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { isLoggedIn, login, logout } from '../../utils/auth.utils'

const Header: React.FC = () => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn(session, loading)) {
      if (router) {
        router.push('/')
      }
    }
  }, [session, loading])

  return (
    <header className="header__container">
      <div className="header__container__logo">
        <h1>IDS management</h1>
      </div>
      <div className="header__container__options">
        {isLoggedIn(session, loading) && (
          <div className="header__container__user">
            <div className="header__username">{session?.user.name}</div>
            <div className="header__container__logout">
              <button
                type="button"
                className="header__button__logout"
                onClick={() => logout(session)}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        {!isLoggedIn(session, loading) && (
          <div className="header__container__logout">
            <button
              type="button"
              className="header__button__logout"
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
