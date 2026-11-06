import { buildPhotoSelectorSubSection } from './buildPhotoSelectorSubSection'
import { B_TEMP } from '../../lib/constants'

// B-temp shows the redesign photo selector only when its redesign flag is on.
// With the flag off there is no in-app photo step for B-temp.
export const subSectionQualityPhotoTemp = buildPhotoSelectorSubSection({
  id: 'photoStepTemp',
  applicationFor: B_TEMP,
  redesignFlagKey: 'isBTempRedesignEnabled',
  withNoPhotoAlert: true,
})
