import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_FULL_RENEWAL_65 } from '../../lib/constants'

// 65+ renewal shows the redesign photo selector only when its redesign flag is
// on. With the flag off, the legacy `subSectionQualityPhoto` step handles 65+.
export const subSectionQualityPhoto65 = buildPhotoSelectorSubSection({
  id: 'photoStep65',
  applicationFor: B_FULL_RENEWAL_65,
  redesignFlagKey: 'is65RenewalRedesignEnabled',
  withNoPhotoAlert: true,
})
