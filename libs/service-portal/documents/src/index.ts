import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { User } from '@island.is/auth/react'
import { DelegationType } from '@island.is/auth-api-lib'
import differenceInYears from 'date-fns/differenceInYears'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

// const enabled = (userInfo: any) => {
//   const hasScope = userInfo.scopes.includes(DocumentsScope.main)
//   const isLegalGuardian = userInfo.profile.delegationType.includes(
//     DelegationType.LegalGuardian,
//   )
//   const isOver15 =
//     differenceInYears(new Date(), userInfo.profile.dateOfBirth) > 15
//   return !(isLegalGuardian && isOver15) || hasScope
// }
export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      enabled: userInfo.scopes.includes(DocumentsScope.main), //enabled(userInfo),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
