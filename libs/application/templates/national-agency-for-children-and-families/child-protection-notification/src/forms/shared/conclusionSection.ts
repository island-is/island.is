import { buildImageField } from '@island.is/application/core'
import { FamilyIllustration } from '@island.is/application/assets/graphics'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { completedMessages } from '../../lib/messages'

export const conclusionSection = buildFormConclusionSection({
  sectionTitle: completedMessages.sectionTitle,
  multiFieldTitle: completedMessages.multiFieldTitle,
  // TODO: Make alertTitle dynamic to append the actual service provider name from answers
  alertTitle: completedMessages.alertTitle,
  alertMessage: completedMessages.alertMessage,
  alertType: 'success',
  accordion: false,
  descriptionFieldDescription: completedMessages.thankYouDescription,
  bottomButtonLabel: completedMessages.closeButton,
  bottomButtonMessage: completedMessages.bottomButtonMessage,
  bottomButtonLink: '/minarsidur/umsoknir',
  image: buildImageField({
    id: 'completedImage',
    image: FamilyIllustration,
    imageWidth: 'auto',
    imagePosition: 'center',
    marginTop: 4,
    marginBottom: 4,
  }),
})
