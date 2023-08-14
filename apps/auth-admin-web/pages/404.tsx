import React from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../components/Layout/ContentWrapper'

const ErrorPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()

  const toMainPage = () => {
    router.replace('/')
  }

  return (
    <ContentWrapper>
      <div className="error404">
        <h1>Page not found</h1>
        <button
          type="button"
          onClick={toMainPage}
          className="error404__button__back"
        >
          Back to main page
        </button>
      </div>
    </ContentWrapper>
  )
}
export default ErrorPage
