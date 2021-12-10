import React from 'react'
import { useRouter } from 'next/router'

const ErrorPage: React.FC = () => {
  const router = useRouter()

  const toMainPage = () => {
    router.replace('/')
  }

  return (
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
  )
}
export default ErrorPage
