import { lazy } from 'react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { PortalModule } from '@island.is/portals/core'
import { FormSystemPaths } from './lib/paths'
import { formsLoader } from './screens/Forms/Forms.loader'
import { formLoader } from './screens/Form/Form.loader'
import { m } from '@island.is/form-system/ui'

const Form = lazy(() => import('./screens/Form/Form'))
const Forms = lazy(() => import('./screens/Forms/Forms'))

const allowedScopes: string[] = [
  AdminPortalScope.formSystem,
  AdminPortalScope.formSystemAdmin,
]

export const formSystemModule: PortalModule = {
  name: m.rootName,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => {
    return [
      {
        name: m.rootName,
        path: FormSystemPaths.FormSystemRoot,
        element: <Forms />,
        loader: formsLoader(props),
      },
      {
        name: m.rootName,
        path: FormSystemPaths.Form,
        element: <Form />,
        loader: formLoader(props),
      },
    ]
  },
}
