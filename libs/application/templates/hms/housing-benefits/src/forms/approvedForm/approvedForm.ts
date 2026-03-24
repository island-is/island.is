import {
  buildAlertMessageField,
  buildForm,
  buildImageField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  coreMessages,
} from '@island.is/application/core'
import { HikingAndWateringPlants } from '@island.is/application/assets/graphics'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'

export const approvedForm = buildForm({
  id: 'approvedForm',
  mode: FormModes.APPROVED,
  logo: HmsLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'approvedSection',
      tabTitle: m.institutionMessages.approvedTitle,
      children: [
        buildMultiField({
          id: 'approvedMultiField',
          title: m.institutionMessages.approvedTitle,
          children: [
            buildAlertMessageField({
              id: 'approvedSummaryAlert',
              title: m.institutionMessages.approvedTitle,
              message: m.institutionMessages.approvedMessage,
              alertType: 'success',
              marginBottom: 4,
            }),
            buildImageField({
              id: 'approvedIllustration',
              image: HikingAndWateringPlants,
              alt: '',
              doesNotRequireAnswer: true,
              imagePosition: 'center',
              imageWidth: 'full',
              marginBottom: 2,
            }),
            buildMessageWithLinkButtonField({
              id: 'approvedServicePortalLink',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
              marginBottom: [4, 4, 12],
            }),
          ],
        }),
      ],
    }),
  ],
})
