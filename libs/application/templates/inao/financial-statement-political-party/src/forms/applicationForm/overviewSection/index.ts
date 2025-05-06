import {
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
  capitalOverviewItems,
  debtOverviewItems,
  debtsAndCashOverviewItems,
  expensesOverviewItems,
  filesOverviewItems,
  incomeOverviewItems,
  propertiesOverviewItems,
} from '../../../utils/overviewItems'

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
          id: 'descriptionOverviewField',
          title: m.aboutOverview,
          items: aboutOverviewItems,
        }),
        buildOverviewField({
          id: 'incomeOverviewField',
          title: m.income,
          items: incomeOverviewItems,
          backId: 'operatingCostMultiField',
        }),
        buildOverviewField({
          id: 'expensesOverviewField',
          title: m.expenses,
          items: expensesOverviewItems,
          backId: 'operatingCostMultiField',
        }),
        buildOverviewField({
          id: 'capitalOverviewField',
          title: m.capitalNumbers,
          items: capitalOverviewItems,
          backId: 'capitalNumber',
        }),
        buildOverviewField({
          id: 'propertiesOverviewField',
          title: m.properties,
          items: propertiesOverviewItems,
          backId: 'equitiesAndLiabilitiesMultiField',
        }),
        buildOverviewField({
          id: 'debtsOverviewField',
          title: m.debts,
          items: debtOverviewItems,
          backId: 'equitiesAndLiabilitiesMultiField',
        }),
        buildOverviewField({
          id: 'debtsAndCashOverviewField',
          title: m.debtsAndCash,
          items: debtsAndCashOverviewItems,
          backId: 'equitiesAndLiabilitiesMultiField',
        }),
        buildOverviewField({
          condition: (answers) => {
            const fileName = getValueViaPath<string>(
              answers,
              'attachments.file.0.name',
            )
            return Boolean(fileName)
          },
          id: 'filesOverviewField',
          title: m.files,
          attachments: filesOverviewItems,
          backId: 'attachments.file',
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
