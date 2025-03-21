import { m } from '@island.is/portals/my-pages/core'
import { SignatureCollectionPaths } from './paths'
import { PortalNavigationItem } from '@island.is/portals/core'

export const companySignatureCollectionNavigation: PortalNavigationItem = {
  name: m.signatureCollectionLists,
  searchHide: true,
  path: SignatureCollectionPaths.CompanySignatureCollectionParliamentaryLists,
  icon: {
    icon: 'receipt',
  },
  description: m.signatureCollectionParliamentaryListsCompany,
}
