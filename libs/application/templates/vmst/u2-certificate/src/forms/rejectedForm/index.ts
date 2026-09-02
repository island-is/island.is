import {
  buildAlertMessageField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildOverviewField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { getOverviewItems } from '../../utils/getOverviewItems'
import {
  applicationMessages,
  rejectedForm as rfm,
  sharedMessages,
} from '../../lib/messages'

export const RejectedForm = buildForm({
  id: 'RejectedForm',
  mode: FormModes.DRAFT,
  logo: DirectorateOfLabourLogo,
  title: applicationMessages.name,
  children: [
    buildMultiField({
      id: 'revokedMultiField',
      title: sharedMessages.yourApplicationTitle,
      children: [
        buildAlertMessageField({
          id: 'rejectedAlertField',
          alertType: 'error',
          title: rfm.general.alertTitle,
        }),
        buildOverviewField({
          id: 'rejectedOverview',
          items: getOverviewItems,
        }),
        buildMessageWithLinkButtonField({
          id: 'rejectBackToApplication',
          url: '/umsoknir/u2-vottord',
          buttonTitle: sharedMessages.newApplicationButton,
          message: sharedMessages.newApplicationMessage,
        }),
      ],
    }),
  ],
})
