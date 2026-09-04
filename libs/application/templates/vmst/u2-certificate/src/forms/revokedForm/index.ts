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
  revokedForm as rfm,
  sharedMessages,
} from '../../lib/messages'

export const RevokedForm = buildForm({
  id: 'RevokedForm',
  mode: FormModes.REJECTED,
  logo: DirectorateOfLabourLogo,
  title: applicationMessages.name,
  children: [
    buildMultiField({
      id: 'revokedMultiField',
      title: sharedMessages.yourApplicationTitle,
      children: [
        buildAlertMessageField({
          id: 'revokedAlertField',
          alertType: 'error',
          title: rfm.general.alertTitle,
        }),
        buildOverviewField({
          id: 'revokedOverview',
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
