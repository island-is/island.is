import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import differenceInYears from 'date-fns/differenceInYears'
import { User } from '@island.is/shared/types'
import { DelegationType } from '@island.is/auth-api-lib'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

const enabled = (userInfo: User) => {
  const isLegalGuardian = userInfo.profile.delegationType?.includes(
    DelegationType.LegalGuardian,
  )
  const is16OrOlder =
    differenceInYears(new Date(), userInfo.profile.dateOfBirth) >= 16
  // If user is a legal guardian, child is 16 or older & no scope present for documents, then documents are disabled
  // If not, than only listen to scope
  return isLegalGuardian &&
    is16OrOlder &&
    !userInfo.scopes.includes(DocumentsScope.main)
    ? false
    : userInfo.scopes.includes(DocumentsScope.main)
}

export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      enabled: enabled(userInfo as User),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
