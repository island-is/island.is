import {
  buildForm,
  buildMultiField,
  buildSection,
  buildDescriptionField,
  buildMessageWithLinkButtonField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'

export const Rejected: Form = buildForm({
  id: 'GrindavikHousingBuyoutRejected',
  title: m.application.general.name,
  mode: FormModes.REJECTED,
  logo: DistrictCommissionersLogo,
  children: [
    buildSection({
      id: 'applicationRejected',
      title: m.rejected.sectionTitle,
      children: [
        buildMultiField({
          id: 'applicationRejectedMultiField',
          title: m.rejected.sectionTitle,
          children: [
            buildDescriptionField({
              id: 'applicationRejectedIntro',
              marginBottom: 3,
              description: m.rejected.text,
            }),
            buildMessageWithLinkButtonField({
              id: 'applicationRejectedLink',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
            }),
          ],
        }),
      ],
    }),
  ],
})
