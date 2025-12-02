import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule, PortalModuleRoutesProps } from '@island.is/portals/core'
import { DocumentProviderPaths } from './lib/paths'
import { m } from './lib/messages'
import { Navigate } from 'react-router-dom'
import React from 'react'

const DocumentProviders = lazy(() =>
  import('./screens/DocumentProviders/DocumentProviders'),
)
const SingleDocumentProvider = lazy(() =>
  import('./screens/SingleDocumentProvider/SingleDocumentProvider'),
)

const InstitutionDocumentProviders = lazy(() =>
  import('./screens/InstitutionDocumentProviders/InstitutionDocumentProviders'),
)
const InstitutionSingleDocumentProvider = lazy(() =>
  import(
    './screens/InstitutionSingleDocumentProvider/InstitutionSingleDocumentProvider'
  ),
)

const PaperScreen = lazy(() => import('./screens/Paper/Paper'))
const CategoriesAndTypesScreen = lazy(() =>
  import('./screens/CategoriesAndTypes'),
)

const Root = lazy(() => import('./screens/Root/Root'))

const allowedScopes: string[] = [
  AdminPortalScope.documentProvider,
  AdminPortalScope.documentProviderInstitution,
]

const getOverviewScreen = ({
  userInfo,
}: PortalModuleRoutesProps): React.ReactNode => {
  if (userInfo.scopes.includes(AdminPortalScope.documentProviderInstitution)) {
    return <InstitutionDocumentProviders />
  }
  return <DocumentProviders />
}

const getSingleDocumentProviderScreen = ({
  userInfo,
}: PortalModuleRoutesProps): React.ReactNode => {
  if (userInfo.scopes.includes(AdminPortalScope.documentProviderInstitution)) {
    return <InstitutionSingleDocumentProvider />
  }
  return <SingleDocumentProvider />
}

export const documentProviderModule: PortalModule = {
  name: m.rootName,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => {
    return [
      {
        name: m.rootName,
        path: DocumentProviderPaths.DocumentProviderRoot,
        element: <Root />,
        children: [
          {
            name: 'index',
            path: DocumentProviderPaths.DocumentProviderRoot,
            index: true,
            element: (
              <Navigate to={DocumentProviderPaths.DocumentProviderOverview} />
            ),
          },
          {
            name: m.overview,
            path: DocumentProviderPaths.DocumentProviderOverview,
            element: getOverviewScreen(props),
          },
          {
            name: m.documentProviderSingle,
            path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
            element: getSingleDocumentProviderScreen(props),
            dynamic: true,
            navHide: true,
          },
          {
            name: m.paper,
            path: DocumentProviderPaths.DocumentProviderPaper,
            element: <PaperScreen />,
            enabled: props.userInfo.scopes.includes(
              AdminPortalScope.documentProvider,
            ),
          },
          {
            name: m.catAndTypeName,
            path: DocumentProviderPaths.DocumentProviderCategoryAndType,
            element: <CategoriesAndTypesScreen />,
            enabled: props.userInfo.scopes.includes(
              AdminPortalScope.documentProvider,
            ),
          },
        ],
      },
    ]
  },
}
