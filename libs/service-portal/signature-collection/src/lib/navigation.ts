import { m } from '@island.is/service-portal/core'
import { SignatureCollectionPaths } from './paths'
import { PortalNavigationItem } from '@island.is/portals/core'

export const companySignatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureCollectionLists,
  path: SignatureCollectionPaths.CompanySignatureCollectionParliamentaryLists,
  icon: {
    icon: 'receipt',
  },
  description: m.signatureCollectionParliamentaryListsCompany,
}
