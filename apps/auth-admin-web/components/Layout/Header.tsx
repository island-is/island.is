import React, { useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

const Header: React.FC = () => {
  const [session, loading] = useSession()
  const router = useRouter()

  const login = async () => {
    signIn('identity-server')
  }

  const logout = () => {
    session &&
      signOut({
        callbackUrl: `${window.location.origin}/api/auth/logout?id_token=${session.idToken}`,
      })
  }

  const isExpired = (session: any): boolean => {
    return (
      (!session && !loading) ||
      (session && new Date(session.expires) < new Date())
    )
  }

  useEffect(() => {
    if (isExpired(session)) {
      router.push('/')
    }
  }, [session])

  return (
    <header className="header__container">
      <div className="header__container__logo">
        <h1>IDS management</h1>
      </div>
      <div className="header__container__options">
        {session && !isExpired(session) && (
          <div className="header__container__user">
            <div className="header__username">{session.user.name}</div>
            <div className="header__container__logout">
              <button
                type="button"
                className="header__button__logout"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        {(!session || isExpired(session)) && (
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
