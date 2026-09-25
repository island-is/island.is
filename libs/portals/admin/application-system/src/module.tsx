import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule, PortalModuleRoutesProps } from '@island.is/portals/core'
import React, { lazy } from 'react'
import { m } from './lib/messages'
import { ApplicationSystemPaths } from './lib/paths'
import { Navigate, useParams } from 'react-router-dom'

const Root = lazy(() => import('./screens/Root/Root'))
const TranslationWorkspace = lazy(() =>
  import('./screens/TranslationWorkspace/TranslationWorkspace').then((m) => ({
    default: m.TranslationWorkspace,
  })),
)
const SharedNamespaceTranslationWorkspace = lazy(() =>
  import(
    './screens/SharedNamespaceTranslationWorkspace/SharedNamespaceTranslationWorkspace'
  ).then((m) => ({
    default: m.SharedNamespaceTranslationWorkspace,
  })),
)

const TranslationWorkspaceRoute = () => {
  const { typeId } = useParams<{ typeId: string }>()
  return <TranslationWorkspace key={typeId} />
}

const SharedNamespaceTranslationWorkspaceRoute = () => {
  const { namespace } = useParams<{ namespace: string }>()
  return <SharedNamespaceTranslationWorkspace key={namespace} />
}

const allowedScopes: string[] = [
  AdminPortalScope.applicationSystemAdmin,
  AdminPortalScope.applicationSystemInstitution,
]
const getRoot = ({ userInfo }: PortalModuleRoutesProps): React.ReactNode => {
  const isSuperAdmin = userInfo.scopes.includes(
    AdminPortalScope.applicationSystemAdmin,
  )
  return <Root isSuperAdmin={isSuperAdmin} />
}

export const applicationSystemAdminModule: PortalModule = {
  name: m.applicationSystem,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    {
      name: m.overview,
      path: ApplicationSystemPaths.Root,
      element: getRoot(props),
      children: [
        {
          name: 'index',
          path: ApplicationSystemPaths.Root,
          index: true,
          element: <Navigate to={ApplicationSystemPaths.Overview} />,
        },
      ],
    },
    {
      name: m.translations,
      path: '/umsoknakerfi/thydingar/shared/:namespace',
      element: <SharedNamespaceTranslationWorkspaceRoute />,
    },
    {
      name: m.translations,
      path: ApplicationSystemPaths.SharedNamespaceTranslationWorkspace,
      element: <SharedNamespaceTranslationWorkspaceRoute />,
    },
    {
      name: m.translations,
      path: ApplicationSystemPaths.TranslationWorkspace,
      element: <TranslationWorkspaceRoute />,
    },
  ],
}
