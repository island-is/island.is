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
  cemeteryEquitiesAndLiabilitiesOverviewItems,
  debtsOverviewItems,
  equityOverviewItems,
  expensesOverviewItems,
  incomeOverviewItems,
} from '../../../utils/overviewItems'
import { showInfoAlertInOverview } from '../../../utils/overviewUtils'
import { isCemetryUnderFinancialLimit } from '../../../utils/helpers'

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
          id: 'incomeOverviewCemetryField',
          title: m.income,
          items: incomeOverviewItems,
          backId: 'cemetryIncomeAndExpense',
        }),
        buildOverviewField({
          id: 'expensesOverviewCemetryField',
          title: m.expenses,
          items: expensesOverviewItems,
          backId: 'cemetryIncomeAndExpense',
        }),
        buildOverviewField({
          id: 'capitalNumbersOverviewCemetryField',
          title: m.capitalNumbers,
          items: capitalNumbersOverviewItems,
          backId: 'capitalNumber',
        }),
        buildOverviewField({
          id: 'assetsOverviewCemetryField',
          title: m.properties,
          items: assetsOverviewItems,
          backId: 'cemetryEquitiesAndLiabilities',
        }),
        buildOverviewField({
          id: 'liabilitiesOverviewCemetryField',
          title: m.debts,
          items: debtsOverviewItems,
          backId: 'cemetryEquitiesAndLiabilities',
        }),
        buildOverviewField({
          id: 'equityOverviewCemetryField',
          title: m.equity,
          items: equityOverviewItems,
        }),
        buildOverviewField({
          id: 'debtsAndEquityOverviewCemetryField',
          title: m.debtsAndCash,
          items: cemeteryEquitiesAndLiabilitiesOverviewItems,
          backId: 'cemetryEquitiesAndLiabilities',
        }),
        buildOverviewField({
          condition: isCemetryUnderFinancialLimit,
          id: 'cemeteryBoardmembersOverviewCemetryField',
          title: m.cemeteryBoardmembers,
          items: boardMembersOverviewItems,
          backId: 'caretakers',
        }),
        buildOverviewField({
          id: 'fileOverviewCemetryField',
          title: m.files,
          attachments: attachmentsOverviewItems,
          backId: 'attachments.file',
        }),
        buildAlertMessageField({
          condition: showInfoAlertInOverview,
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
