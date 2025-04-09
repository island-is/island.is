import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const otherBenefitsSubSection = buildSubSection({
  id: 'otherBenefitsSubSection',
  title: payoutMessages.otherBenefits.sectionTitle,
  children: [
    buildMultiField({
      id: 'otherBenefitsSubSection',
      title: payoutMessages.otherBenefits.pageTitle,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
