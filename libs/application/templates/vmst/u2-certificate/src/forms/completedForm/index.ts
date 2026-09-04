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
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { getOverviewItems } from '../../utils/getOverviewItems'
import { HandShake } from '@island.is/application/assets/graphics'
import {
  applicationMessages,
  completedForm as cfm,
  sharedMessages,
} from '../../lib/messages'

export const CompletedForm = buildForm({
  id: 'CompletedForm',
  mode: FormModes.COMPLETED,
  logo: DirectorateOfLabourLogo,
  title: applicationMessages.name,
  children: [
    buildMultiField({
      id: 'completedMultiField',
      title: sharedMessages.yourApplicationTitle,
      children: [
        buildAlertMessageField({
          id: 'completedAlertField',
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
          id: 'completedOverview',
          items: getOverviewItems,
        }),
        buildAlertMessageField({
          id: 'completedAlertInfo',
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
          id: 'completedBackToServicePortal',
          url: '/minarsidur/umsoknir',
          buttonTitle: coreMessages.openServicePortalButtonTitle,
          message: coreMessages.openServicePortalMessageText,
          marginBottom: [4, 4, 12],
        }),
      ],
    }),
  ],
})
