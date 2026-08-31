import {
  buildAlertMessageField,
  buildDividerField,
  buildExpandableDescriptionField,
  buildForm,
  buildImageField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildOverviewField,
  coreMessages,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { getOverviewItems } from '../../utils/getOverviewItems'
import { HandShake } from '@island.is/application/assets/graphics'
import {
  applicationMessages,
  completedForm as cfm,
  sharedMessages,
} from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  title: applicationMessages.name,
  children: [
    buildMultiField({
      id: 'reviewMultiField',
      title: sharedMessages.yourApplicationTitle,
      children: [
        buildAlertMessageField({
          id: 'reviewAlertField',
          alertType: 'success',
          title: cfm.general.alertSuccessTitle,
          message: cfm.general.alertSuccessMessage,
        }),
        buildExpandableDescriptionField({
          id: 'expandableDescriptionField',
          title: sharedMessages.whatHappensNextTitle,
          description: sharedMessages.whatHappensNextDescription,
        }),
        buildOverviewField({
          id: 'reviewOverview',
          items: getOverviewItems,
        }),
        buildAlertMessageField({
          id: 'reviewAlertInfo',
          alertType: 'info',
          title: cfm.general.alertInfoTitle,
          message: cfm.general.alertInfoMessage,
        }),
        buildDividerField({}),
        buildImageField({
          id: 'image',
          image: HandShake,
          doesNotRequireAnswer: true,
          marginBottom: 2,
        }),
        buildMessageWithLinkButtonField({
          id: 'reviewBackToServicePortal',
          url: '/minarsidur/umsoknir',
          buttonTitle: coreMessages.openServicePortalButtonTitle,
          message: coreMessages.openServicePortalMessageText,
          marginBottom: [4, 4, 12],
        }),
      ],
    }),
  ],
})
