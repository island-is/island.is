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
  accordion: false,
  descriptionFieldDescription: completedMessages.thankYouDescription,
  bottomButtonMessage: completedMessages.bottomButtonMessage,
  image: buildImageField({
    id: 'completedImage',
    image: FamilyIllustration,
    imageWidth: 'auto',
    imagePosition: 'center',
    marginTop: 4,
    marginBottom: 4,
  }),
})
