import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { BE } from '../../lib/constants'

// BE uses the redesign photo selector unconditionally — there is no BE photo
// feature flag (only `isBEApplicationEnabled`, which gates whether BE is offered).
export const subSectionQualityPhotoBE = buildPhotoSelectorSubSection({
  id: 'photoStepBE',
  applicationFor: BE,
  withNoPhotoAlert: false,
})
