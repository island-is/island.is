import { m } from '../../lib/messages'
import { BE } from '../../lib/constants'
import { hasNoDrivingLicenseInOtherCountry, isVisible } from '../../lib/utils'
import { buildPhotoSelectionSubSection } from './builders/buildPhotoSelectionSubSection'

export const subSectionQualityPhotoBE = buildPhotoSelectionSubSection({
  id: 'photoStepBE',
  title: m.photoSelectionTitle,
  condition: isVisible(
    (answers) => answers.applicationFor === BE,
    hasNoDrivingLicenseInOtherCountry,
  ),
})
