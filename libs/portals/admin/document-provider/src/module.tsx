import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { DocumentProviderPaths } from './lib/paths'
import { m } from './lib/messages'
import { Navigate } from 'react-router-dom'

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

const allowedScopes: string[] = [
  AdminPortalScope.documentProvider,
  AdminPortalScope.documentProviderAdmin,
  AdminPortalScope.documentProviderInstitution,
]

export const documentProviderModule: PortalModule = {
  name: m.rootName,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: () => {
    return [
      {
        name: m.rootName,
        path: DocumentProviderPaths.DocumentProviderRoot,
        element: (
          <Navigate
            to={DocumentProviderPaths.DocumentProviderRootOverview}
            replace
          />
        ),
      },
      {
        name: m.overview,
        path: DocumentProviderPaths.DocumentProviderOverview,
        element: <DocumentProviders />,
      },
      {
        name: m.documentProviderSingle,
        path: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
        element: <SingleDocumentProvider />,
      },
      {
        name: m.overview,
        path: DocumentProviderPaths.InstitutionDocumentProviderOverview,
        element: <InstitutionDocumentProviders />,
      },
      {
        name: m.documentProviderSingle,
        path: DocumentProviderPaths.InstitutionDocumentProviderDocumentProvidersSingle,
        element: <InstitutionSingleDocumentProvider />,
      },
      {
        name: m.paper,
        path: DocumentProviderPaths.DocumentProviderPaper,
        element: <PaperScreen />,
      },
      {
        name: m.catAndTypeName,
        path: DocumentProviderPaths.DocumentProviderCategoryAndType,
        element: <CategoriesAndTypesScreen />,
      },
    ]
  },
}
