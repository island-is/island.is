import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_FULL } from '../../lib/constants'

// B-full shows the redesign photo selector only when its redesign flag is on.
// With the flag off, the legacy `subSectionQualityPhoto` step handles B-full.
export const subSectionQualityPhotoBFull = buildPhotoSelectorSubSection({
  id: 'photoStepBFull',
  applicationFor: B_FULL,
  redesignFlagKey: 'isBFullRedesignEnabled',
  withNoPhotoAlert: true,
})
