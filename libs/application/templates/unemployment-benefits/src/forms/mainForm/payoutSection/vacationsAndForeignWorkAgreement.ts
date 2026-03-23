import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import {
  payout as payoutMessages,
  application as applicationMessages,
} from '../../../lib/messages'

export const vacationsAndForeginWorkAgreementSubSection = buildSubSection({
  id: 'vacationsAndForeginWorkAgreementSubSection',
  title: payoutMessages.vacationsAndForeignWorkAgreement.sectionTitle,
  children: [
    buildMultiField({
      id: 'vacationsAndForeginWorkAgreementSubSection',
      title: payoutMessages.vacationsAndForeignWorkAgreement.pageTitle,
      description:
        payoutMessages.vacationsAndForeignWorkAgreement.pageDescription,
      children: [
        buildCheckboxField({
          id: 'vacationsAndForeginWorkAgreement',
          backgroundColor: 'blue',
          large: true,
          options: [
            {
              value: YES,
              label: applicationMessages.agreeCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
