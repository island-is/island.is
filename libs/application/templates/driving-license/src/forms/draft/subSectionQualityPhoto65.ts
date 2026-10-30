import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_FULL_RENEWAL_65 } from '../../lib/constants'

// 65+ renewal always uses the photo selector (like BE): the legacy 65+ flow is
// gone, since RLS removed its submit endpoint.
export const subSectionQualityPhoto65 = buildPhotoSelectorSubSection({
  id: 'photoStep65',
  applicationFor: B_FULL_RENEWAL_65,
  withNoPhotoAlert: true,
})
