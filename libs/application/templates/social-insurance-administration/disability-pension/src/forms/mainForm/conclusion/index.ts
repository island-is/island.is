import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'
import ConfirmationImage from '../../../assets/ConfirmationImage'

export const conclusionSection = buildSection({
  id: SectionRouteEnum.CONFIRMATION,
  title: m.confirmation.title,
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
          space: 'gutter',
          description: m.confirmation.whatHappensNextOptions,
        }),
        buildCustomField({
          id: `${SectionRouteEnum.CONFIRMATION}.customField`,
          title: m.confirmation.warningTitle,
          description: m.confirmation.warningDescription,
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
