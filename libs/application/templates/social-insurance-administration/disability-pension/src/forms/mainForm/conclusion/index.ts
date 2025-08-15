import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import ConfirmationImage from '../../../assets/ConfirmationImage'

//TODO: Move to "completedForm" ??
export const conclusionSection = buildSection({
  id: SectionRouteEnum.CONFIRMATION,
  tabTitle: disabilityPensionFormMessage.confirmation.title,
  title: disabilityPensionFormMessage.confirmation.tabTitle,
  children: [
    buildMultiField({
      id: SectionRouteEnum.CONFIRMATION,
      title: disabilityPensionFormMessage.confirmation.title,
      space: 'containerGutter',
      children: [
        //TODO: Needs valiadation that the application has been sent?
        buildAlertMessageField({
          id: `${SectionRouteEnum.CONFIRMATION}.successMessage`,
          alertType: 'success',
          title: disabilityPensionFormMessage.confirmation.successTitle,
          message: disabilityPensionFormMessage.confirmation.successDescription,
          marginBottom: 0,
        }),
        buildDescriptionField({
          id: `${SectionRouteEnum.CONFIRMATION}.bullets`,
          title: disabilityPensionFormMessage.confirmation.whatHappensNext,
          titleVariant: 'h4',
          space: 'gutter',
          description:
            disabilityPensionFormMessage.confirmation.whatHappensNextOptions,
        }),
        buildCustomField({
          id: `${SectionRouteEnum.CONFIRMATION}.customField`,
          title: disabilityPensionFormMessage.confirmation.customFieldTitle,
          description:
            disabilityPensionFormMessage.confirmation.customFieldDescription,
          component: 'Confirmation',
        }),
        buildImageField({
          id: `${SectionRouteEnum.CONFIRMATION}.image`,
          image: ConfirmationImage,
          imagePosition: 'center',
          marginTop: 3,
        }),
      ],
    }),
  ],
})
