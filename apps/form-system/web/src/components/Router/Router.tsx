import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { LoadingScreen } from '@island.is/react/components'
import { useRef } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { m } from '../../lib/messages'
import { BASE_PATH, routes } from '../../lib/routes'

export const Router = () => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const router = useRef<ReturnType<typeof createBrowserRouter>>()
  useNamespaces('form.system')

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
