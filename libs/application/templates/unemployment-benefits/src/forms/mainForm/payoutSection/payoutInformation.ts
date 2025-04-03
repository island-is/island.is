import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const payoutInformationSubSection = buildSubSection({
  id: 'payoutInformationSubSection',
  title: 'payoutInformationSubSection',
  children: [
    buildMultiField({
      id: 'payoutInformationSubSection',
      title: payoutMessages.payoutInformation.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
