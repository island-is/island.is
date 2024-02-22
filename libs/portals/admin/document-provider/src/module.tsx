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
const PaperScreen = lazy(() => import('./screens/Paper/Paper'))
const CategoriesAndTypesScreen = lazy(() =>
  import('./screens/CategoriesAndTypes'),
)

export const documentProviderModule: PortalModule = {
  name: m.rootName,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.includes(AdminPortalScope.documentProvider),
  routes: () => {
    return [
      {
        name: m.rootName,
        path: DocumentProviderPaths.DocumentProviderRoot,
        element: (
          <Navigate
            to={DocumentProviderPaths.DocumentProviderOverview}
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
