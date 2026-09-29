import { FamilyIllustration } from '@island.is/application/assets/graphics'
import { buildImageField } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusionMessages } from '../../lib/messages'
import { Roles } from '../../utils/constants'
import { getApplicantRole } from '../../utils/roleUtils'

export const conclusionSection = buildFormConclusionSection({
  sectionTitle: conclusionMessages.sectionTitle,
  multiFieldTitle: conclusionMessages.multiFieldTitle,
  alertTitle: conclusionMessages.alertTitle,
  alertMessage: conclusionMessages.alertMessage,
  accordion: false,
  descriptionFieldDescription: (application) => {
    const role = getApplicantRole(application.applicant)

    return role === Roles.ADULT_PROCURATION_APPLICANT
      ? conclusionMessages.thankYouDescriptionAdultProcuration
      : role === Roles.ADULT_PERSONAL_APPLICANT
      ? conclusionMessages.thankYouDescriptionAdultPersonal
      : conclusionMessages.thankYouDescriptionMinor
  },
  bottomButtonMessage: conclusionMessages.bottomButtonMessage,
  image: buildImageField({
    id: 'conclusionImage',
    image: FamilyIllustration,
    imageWidth: 'auto',
    imagePosition: 'center',
    marginTop: 4,
    marginBottom: 4,
  }),
})
