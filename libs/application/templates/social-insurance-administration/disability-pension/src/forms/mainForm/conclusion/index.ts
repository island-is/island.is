import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types/routes'
import ConfirmationImage from '../../../assets/ConfirmationImage'

export const conclusionSection = buildSection({
  id: SectionRouteEnum.CONFIRMATION,
  tabTitle: m.confirmation.tabTitle,
  children: [
    buildMultiField({
      id: SectionRouteEnum.CONFIRMATION,
      title: m.confirmation.title,
      space: 'containerGutter',
      children: [
        buildAlertMessageField({
          id: `${SectionRouteEnum.CONFIRMATION}.successMessage`,
          alertType: 'success',
          title: m.confirmation.successTitle,
          message: m.confirmation.successDescription,
          marginBottom: 0,
        }),
        buildDescriptionField({
          id: `${SectionRouteEnum.CONFIRMATION}.bullets`,
          title: m.confirmation.whatHappensNext,
          titleVariant: 'h4',
          description: m.confirmation.whatHappensNextOptions,
        }),
        buildAlertMessageField({
          id: `${SectionRouteEnum.CONFIRMATION}.alert`,
          alertType: 'warning',
          title: m.confirmation.warningTitle,
          message: m.confirmation.warningDescription,
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
