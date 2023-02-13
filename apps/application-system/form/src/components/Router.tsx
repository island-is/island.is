import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { useAuth } from '@island.is/auth/react'
import { LoadingScreen } from '@island.is/react/components'
import { BASE_PATH, routes } from '../lib/routes'
import React, { useRef } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

export const Router = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()
  const router = useRef<ReturnType<typeof createBrowserRouter>>()

  if (!userInfo) {
    return <LoadingScreen ariaLabel={formatMessage(m.loginMessage)} />
  }

  if (!router.current) {
    router.current = createBrowserRouter(routes, {
      basename: BASE_PATH,
    })
  }

  return (
    <RouterProvider
      router={router.current}
      fallbackElement={
        <LoadingScreen ariaLabel={formatMessage(m.loginMessage)} />
      }
    />
  )
}
