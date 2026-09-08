import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_FULL } from '../../utils/constants'

// B-full photo selection step.
export const subSectionQualityPhotoBFull = buildPhotoSelectorSubSection({
  id: 'photoStepBFull',
  applicationFor: B_FULL,
  withNoPhotoAlert: true,
})
