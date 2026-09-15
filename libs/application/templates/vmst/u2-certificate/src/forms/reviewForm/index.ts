import {
  buildAlertMessageField,
  buildDividerField,
  buildExpandableDescriptionField,
  buildForm,
  buildImageField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildOverviewField,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { getOverviewItems } from '../../utils/getOverviewItems'
import {
  applicationMessages,
  reviewForm as rfm,
  sharedMessages,
} from '../../lib/messages'
import { ApplicationEvents } from '../../utils/types'
import { HandShake } from '@island.is/application/assets/graphics'

export const ReviewForm = buildForm({
  id: 'ReviewForm',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  title: applicationMessages.name,
  children: [
    buildMultiField({
      id: 'reviewMultiField',
      title: sharedMessages.yourApplicationTitle,
      children: [
        buildAlertMessageField({
          id: 'reviewAlertField',
          alertType: 'info',
          title: rfm.general.alertInfoTitle,
          message: rfm.general.alertInfoDescription,
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
        }),
        buildSubmitField({
          id: 'reviewSubmitField',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              name: rfm.general.revokeButton,
              event: ApplicationEvents.REVOKE,
              type: 'reject',
            },
          ],
        }),
      ],
    }),
  ],
})
