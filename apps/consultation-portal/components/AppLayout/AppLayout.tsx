import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useUser } from '../../context/UserContext'

const AppLayout = ({ children }) => {
  const { isAuthenticated, persistLoginUser, setUserNull, user } = useUser()

  const checkAuth = async () => {
    const check = await fetch(
      `${window.location.origin}/consultation-portal/api/auth/check`,
    )
    const data = await check.json()
    if (data.token) {
      persistLoginUser({ token: data.token })
    }
  }

  if (!isAuthenticated && typeof window !== 'undefined') {
    checkAuth()
  } else if (!user) {
    setUserNull()
  }

  return (
    <div>
      <Head>
        <title>Samradsgatt</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        {/* <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="shortcut icon" href="/favicon.ico" /> */}
      </Head>
      {children}
    </div>
  )
}

export default AppLayout
