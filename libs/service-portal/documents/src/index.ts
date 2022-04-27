import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { User } from '@island.is/auth/react'
import differenceInYears from 'date-fns/differenceInYears'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

const enabled = (userInfo: User) => {
  const hasScope = userInfo.scopes?.includes(DocumentsScope.main)
  const isLegalGuardian = userInfo.profile.delegationType?.includes(
    'LegalGuardian',
  )
  const isOver15 =
    differenceInYears(new Date(), userInfo.profile.dateOfBirth) > 15
  if (isLegalGuardian && isOver15) {
    return false
  }
  if (hasScope) {
    return true
  } else {
    return false
  }
}
export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      enabled: enabled(userInfo),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
