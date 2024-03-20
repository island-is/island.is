import { lazy } from 'react';
import { AdminPortalScope } from '@island.is/auth/scopes'
import { m } from './lib/messages';
import { PortalModule } from '@island.is/portals/core'
import { FormSystemPaths } from './lib/paths'
import { formsLoader } from './screens/Forms/Forms.loader';

const Forms = lazy(() =>
  import('./screens/Forms/Forms')
)

const allowedScopes: string[] = [
  AdminPortalScope.formSystem,
  AdminPortalScope.formSystemSuperUser
]

export const formSystemModule: PortalModule = {
  name: m.formSystemIntro,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: () => {
    return [
      {
        name: m.formSystemTitle,
        path: FormSystemPaths.FormSystemRoot,
        element: <Forms />,
        // loader: formsLoader(props)
      }
    ]
  }
}
