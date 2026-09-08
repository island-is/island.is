import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_FULL_RENEWAL_65 } from '../../utils/constants'

// 65+ renewal photo selection step.
export const subSectionQualityPhoto65 = buildPhotoSelectorSubSection({
  id: 'photoStep65',
  applicationFor: B_FULL_RENEWAL_65,
  withNoPhotoAlert: true,
})
