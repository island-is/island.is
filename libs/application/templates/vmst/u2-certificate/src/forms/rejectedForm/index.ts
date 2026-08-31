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

export const RejectedForm = buildForm({
  id: 'RejectedForm',
  mode: FormModes.DRAFT,
  logo: DirectorateOfLabourLogo,
  title: 'Umsókn um U2 vottorð vegna atvinnuleitar í EES-landi',
  children: [
    buildMultiField({
      id: 'revokedMultiField',
      title: 'Umsóknin þín',
      children: [
        buildAlertMessageField({
          id: 'rejectedAlertField',
          alertType: 'error',
          title: 'Umsókn þín um U2 vottorð hefur því miður verið hafnað',
        }),
        buildOverviewField({
          id: 'rejectedOverview',
          items: getOverviewItems,
        }),
        buildMessageWithLinkButtonField({
          id: 'rejectBackToApplication',
          url: '/umsoknir/u2-vottord',
          buttonTitle: 'Opna umsókn',
          message:
            'Þú getur lagt inn nýja umsókn um U2 vottorð ef aðstæður þínar hafa breyst.',
        }),
      ],
    }),
  ],
})
