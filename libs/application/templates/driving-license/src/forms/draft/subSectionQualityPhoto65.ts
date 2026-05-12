import { getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { B_FULL_RENEWAL_65 } from '../../lib/constants'
import { hasNoDrivingLicenseInOtherCountry, isVisible } from '../../lib/utils'
import { buildPhotoSelectionSubSection } from './builders/buildPhotoSelectionSubSection'

export const subSectionQualityPhoto65 = buildPhotoSelectionSubSection({
  id: 'photoStep65',
  title: m.photoSelectionTitle,
  condition: isVisible(
    (answers) => answers.applicationFor === B_FULL_RENEWAL_65,
    (answers) =>
      getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true,
    hasNoDrivingLicenseInOtherCountry,
  ),
  showEmptyStateAlert: true,
})
