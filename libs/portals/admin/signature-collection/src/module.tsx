import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import { listsLoader } from './screens/Lists/Lists.loader'
import { AdminPortalScope } from '@island.is/auth/scopes'

const Lists = lazy(() => import('./screens/Lists'))

const allowedScopes: string[] = [AdminPortalScope.petitionsAdmin]

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollection,
  layout: 'default',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.SignatureLists,
      element: <Lists />,
      loader: listsLoader(props),
    },
  ],
}
