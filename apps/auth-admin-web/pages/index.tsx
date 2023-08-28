/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link'
import React, { useEffect } from 'react'
import ContentWrapper from '../components/Layout/ContentWrapper'
import { isLoggedIn } from './../utils/auth.utils'
import { useSession } from 'next-auth/client'
import { SessionInfo } from '../entities/common/SessionInfo'
import LocalizationUtils from '../utils/localization.utils'

const Home: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [session, loading] = useSession()

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle()
  }, [])

  if (!isLoggedIn(session as unknown as SessionInfo, loading)) {
    return (
      <ContentWrapper>
        <div className="home__logged-out">
          You are logged out. Click login in the header of the page to login.
          <div className="home__shortcuts">
            <div className="home__shortcuts__item">
              <div className="home__shortcuts__item__description">
                Do you need access?
              </div>
              <div className="home__shortcuts__item__link">
                <a href="TODO:">Get access</a>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <div className="home">
        <div className="home__info">
          The IDS-management system is an interface designed with the purpose of
          allowing the Digital Iceland’s service desk to manage the Digital
          Iceland’s login system’s customer registration on their own. The
          IDS-management system allows its users to register the Clients,
          Resources and Users of each customer.
        </div>
        <div className="home__shortcuts">
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Do you not have access?
            </div>
            <div className="home__shortcuts__item__link">
              <a href="TODO:">Get access</a>
            </div>
          </div>
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Do you need help? Check out the help pages
            </div>
            <div className="home__shortcuts__item__link">
              <a href="TODO:">Help pages</a>
            </div>
          </div>
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Shortcut to create a client
            </div>
            <div className="home__shortcuts__item__link">
              <Link href="/client">Create a new client</Link>
            </div>
          </div>
          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Simplified new Client form
            </div>
            <div className="home__shortcuts__item__link">
              <Link href="/client-basic">Create a new client</Link>
            </div>
          </div>

          <div className="home__shortcuts__item">
            <div className="home__shortcuts__item__description">
              Shortcut to create an API Resource
            </div>
            <div className="home__shortcuts__item__link">
              <Link href="/resource/api-resource">
                Create a new API Resource
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
export default Home
