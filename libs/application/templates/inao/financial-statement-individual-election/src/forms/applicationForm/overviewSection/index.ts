import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  aboutOverviewItems,
  assetsOverviewItems,
  capitalNumbersOverviewItems,
  debtsAndCashOverviewItems,
  debtsOverviewItems,
  expensesOverviewItems,
  fileOverviewItems,
  incomeOverviewItems,
} from '../../../utils/overviewItems'
import { LESS } from '../../../utils/constants'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { isGreaterThanIncomeLimit } from '../../../utils/conditions'

export const overviewSection = buildSection({
  condition: isGreaterThanIncomeLimit,
  id: 'overviewSection',
  title: (application) => {
    return getValueViaPath(application.answers, 'election.incomeLimit') === LESS
      ? m.statement
      : m.overviewSectionTitle
  },
  children: [
    buildMultiField({
      id: 'overview',
      title: (application) => {
        return getValueViaPath(application.answers, 'election.incomeLimit') ===
          LESS
          ? m.statement
          : m.overviewReview
      },
      children: [
        buildDescriptionField({
          id: 'overviewDescription',
          description: m.overviewDescription,
        }),
        buildOverviewField({
          id: 'aboutOverviewField',
          title: m.aboutOverviewTitle,
          items: aboutOverviewItems,
        }),
        buildOverviewField({
          id: 'incomeOverviewField',
          title: m.income,
          items: incomeOverviewItems,
          backId: 'operatinCostfields',
        }),
        buildOverviewField({
          id: 'expensesOverviewField',
          title: m.expenses,
          items: expensesOverviewItems,
          backId: 'operatinCostfields',
        }),
        buildOverviewField({
          id: 'capitalNumbersOverviewField',
          title: m.capitalNumbers,
          items: capitalNumbersOverviewItems,
          backId: 'capitalNumber',
        }),
        buildOverviewField({
          id: 'assetsOverviewField',
          title: m.properties,
          items: assetsOverviewItems,
          backId: 'operations.equitiesAndLiabilities',
        }),
        buildOverviewField({
          id: 'debtsOverviewField',
          title: m.debts,
          items: debtsOverviewItems,
          backId: 'operations.equitiesAndLiabilities',
        }),
        buildOverviewField({
          id: 'debtsAndCashsOverviewField',
          title: m.debtsAndCash,
          items: debtsAndCashOverviewItems,
          backId: 'operations.equitiesAndLiabilities',
        }),
        buildOverviewField({
          id: 'fileOverviewField',
          title: m.attachments,
          attachments: fileOverviewItems,
          backId: 'attachments.file',
        }),
        buildCheckboxField({
          id: 'approveOverview',
          options: [{ label: m.overviewCorrect, value: YES }],
        }),
        buildSubmitField({
          id: 'overviewSubmitField',
          refetchApplicationAfterSubmit: true,
          actions: [
            { event: DefaultEvents.SUBMIT, name: m.send, type: 'primary' },
          ],
        }),
      ],
    }),
  ],
})
