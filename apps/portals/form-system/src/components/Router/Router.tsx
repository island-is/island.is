import { useLocale } from '@island.is/localization'
import { useAuth } from '@island.is/auth/react'
import { useRef } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { LoadingScreen } from '@island.is/react/components'
import { m } from '../../lib/messages'
import { BASE_PATH, routes } from '../../lib/routes'

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
