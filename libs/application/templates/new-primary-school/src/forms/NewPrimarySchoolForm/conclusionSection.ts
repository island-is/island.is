import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { OrganizationSector } from '../../utils/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getSelectedSchoolSector } from '../../utils/newPrimarySchoolUtils'

export const conclusionSection = buildFormConclusionSection({
  expandableIntro: '',
  expandableDescription: (application) => {
    return getSelectedSchoolSector(
      application.answers,
      application.externalData,
    ) === OrganizationSector.PUBLIC
      ? newPrimarySchoolMessages.conclusion.expandableDescription
      : newPrimarySchoolMessages.conclusion.privateSchoolExpandableDescription
  },
})
