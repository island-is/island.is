import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { OrganizationSector, OrganizationSubType } from '../../utils/constants'
import {
  getSelectedSchoolSector,
  getSelectedSchoolSubType,
} from '../../utils/newPrimarySchoolUtils'

export const conclusionSection = buildFormConclusionSection({
  expandableIntro: '',
  expandableDescription: (application) => {
    const selectedSchoolSubType = getSelectedSchoolSubType(
      application.answers,
      application.externalData,
    )

    const selectedSchoolSector = getSelectedSchoolSector(
      application.answers,
      application.externalData,
    )

    if (
      selectedSchoolSubType === OrganizationSubType.INTERNATIONAL_SCHOOL ||
      (selectedSchoolSubType === OrganizationSubType.GENERAL_SCHOOL &&
        selectedSchoolSector === OrganizationSector.PRIVATE)
    ) {
      return newPrimarySchoolMessages.conclusion
        .privateSchoolExpandableDescription
    }

    return newPrimarySchoolMessages.conclusion.expandableDescription
  },
})
