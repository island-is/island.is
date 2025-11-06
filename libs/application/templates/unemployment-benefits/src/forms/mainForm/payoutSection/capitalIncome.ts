import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'

export const capitalIncomeSubSection = buildSubSection({
  id: 'capitalIncomeSubSection',
  title: payoutMessages.capitalIncome.sectionTitle,
  children: [
    buildMultiField({
      id: 'capitalIncomeSubSection',
      title: payoutMessages.capitalIncome.pageTitle,
      description: payoutMessages.capitalIncome.pageDescription,
      children: [
        buildRadioField({
          id: 'capitalIncome.otherIncome',
          width: 'half',
          space: 0,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildFieldsRepeaterField({
          id: 'capitalIncome.capitalIncomeAmount',
          minRows: 1,
          formTitleNumbering: 'none',
          marginTop: 0,

          condition: (answers) =>
            getValueViaPath(answers, 'capitalIncome.otherIncome') === YES,
          fields: {
            amount: {
              component: 'input',
              label: payoutMessages.capitalIncome.amountLabel,
              currency: true,
              required: true,
              allowNegative: false,
            },
          },
        }),
      ],
    }),
  ],
})
