import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_TEMP } from '../../utils/constants'

// B-temp photo selection step.
export const subSectionQualityPhotoTemp = buildPhotoSelectorSubSection({
  id: 'photoStepTemp',
  applicationFor: B_TEMP,
  withNoPhotoAlert: true,
})
