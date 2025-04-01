import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import {
  aboutOverviewItems,
  assetsOverviewItems,
  attachmentsOverviewItems,
  boardMembersOverviewItems,
  capitalNumbersOverviewItems,
  debtsOverviewItems,
  equityOverviewItems,
  expensesOverviewItems,
  incomeOverviewItems,
} from '../../../utils/overviewItems'
import { formatCurrency } from '../../../utils/currency'
import { getOverviewNumbers } from '../../../utils/overviewUtils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.yearlyOverview,
      description: m.review,
      children: [
        buildOverviewField({
          id: 'aboutOverviewCemetryField',
          title: m.aboutOverviewTitle,
          items: aboutOverviewItems,
        }),
        buildOverviewField({
          id: 'expensesOverviewCemetryField',
          title: m.income,
          items: incomeOverviewItems,
        }),
        buildOverviewField({
          id: 'expensesOverviewCemetryField',
          title: m.expenses,
          items: expensesOverviewItems,
        }),
        buildOverviewField({
          id: 'capitalNumbersOverviewCemetryField',
          title: m.capitalNumbers,
          items: capitalNumbersOverviewItems,
        }),
        buildOverviewField({
          id: 'assetsOverviewCemetryField',
          title: m.properties,
          items: assetsOverviewItems,
        }),
        buildOverviewField({
          id: 'liabilitiesOverviewCemetryField',
          title: m.debts,
          items: debtsOverviewItems,
        }),
        buildOverviewField({
          id: 'equityOverviewCemetryField',
          title: m.equity,
          items: equityOverviewItems,
        }),
        buildOverviewField({
          id: 'debtsAndEquityOverviewCemetryField',
          title: m.debtsAndCash,
          items: (answers) => {
            return [
              {
                width: 'half',
                valueText: formatCurrency(
                  getValueViaPath<string>(
                    answers,
                    'equityAndLiabilitiesTotals.equityAndLiabilitiesTotal',
                  ),
                ),
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'cemeteryBoardmembersOverviewCemetryField',
          title: m.cemeteryBoardmembers,
          items: boardMembersOverviewItems,
        }),
        buildOverviewField({
          id: 'fileOverviewCemetryField',
          title: m.files,
          attachments: attachmentsOverviewItems,
        }),
        buildAlertMessageField({
          condition: (answers) => {
            const { totalIncome, fixedAssetsTotal, longTerm, incomeLimit } =
              getOverviewNumbers(answers)

            return (
              Number(totalIncome) < Number(incomeLimit) &&
              fixedAssetsTotal === '0' &&
              longTerm === '0'
            )
          },
          alertType: 'info',
          id: 'overviewCemetryField',
          title: m.SignatureMessage,
          message: (application) => {
            return {
              ...m.overviewAlertMessage,
              values: {
                email: getValueViaPath<string>(
                  application.answers,
                  'about.email',
                ),
              },
            }
          },
        }),
        buildCheckboxField({
          id: 'approveOverview',
          options: [
            {
              label: m.overviewCorrect,
              value: YES,
            },
          ],
        }),
        buildSubmitField({
          id: 'overview.submit',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.send,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
