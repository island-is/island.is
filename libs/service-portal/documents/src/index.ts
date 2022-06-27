import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import differenceInYears from 'date-fns/differenceInYears'
import { User } from '@island.is/shared/types'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

const isLegalAndOver15 = (userInfo: User) => {
  const isLegal = userInfo.profile.delegationType?.includes('LegalGuardian')
  const dateOfBirth = userInfo?.profile.dateOfBirth
  let isOver15 = false
  if (dateOfBirth) {
    isOver15 = differenceInYears(new Date(), dateOfBirth) > 15
  }
  return isLegal && isOver15
}

export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      enabled:
        !isLegalAndOver15(userInfo) ||
        userInfo.scopes?.includes(DocumentsScope.main),
      render: isLegalAndOver15(userInfo)
        ? () =>
            lazy(() => import('./screens/AccessDeniedLegal/AccessDeniedLegal'))
        : () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
