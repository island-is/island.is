import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { LoadingScreen } from '@island.is/react/components'
import { useRef } from 'react'
import { BASE_PATH, routes } from '../../lib/routes'
import { m } from '../../lib/messages'

export const Router = () => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
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
