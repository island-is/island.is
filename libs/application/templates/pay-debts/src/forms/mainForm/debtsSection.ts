import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildStickyFooterField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { debts as messages } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'
import { getDebts } from '../../utils/getDebts'

export const debtsSection = buildSection({
  id: 'debtsSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'debtsSection',
      title: messages.general.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          description: messages.description.description,
          space: 'none',
        }),
        buildStaticTableField({
          id: 'selectedDebts',
          dataTestId: 'debts-table',
          selectable: true,
          header: [
            messages.table.chargeTypeNameHeader,
            messages.table.dueDateHeader,
            messages.table.finalDueDateHeader,
            messages.table.amountHeader,
            messages.table.toPayLabel,
          ],
          rows: (application) => {
            const debts = getDebts(application)

            if (debts.length === 0) {
              return [[messages.table.emptyMessage, '', '', '']]
            }

            return debts.map<StaticText[]>((debt) => [
              debt.chargeTypeName,
              formatDate(debt.dueDate),
              formatDate(debt.finalDueDate),
              formatCurrency(debt.debts.toString()),
            ])
          },
          inputColumn: {
            id: 'debtsToPay',
            getMaxAmount: (application) =>
              getDebts(application).map((debt) => debt.debts),
          },
          footerRow: (application) => [
            messages.table.totalDebtsLabel,
            '',
            '',
            formatCurrency(
              getDebts(application)
                .reduce((total, debt) => total + debt.debts, 0)
                .toString(),
            ),
          ],
        }),
        buildStickyFooterField({
          id: 'debtsSummaryFooter',
          widthReferenceTestId: 'debts-table',
          watchFieldIds: ['debtsToPay', 'selectedDebts'],
          rows: (application: Application) => {
            const totalDebts = getDebts(application).reduce(
              (total, debt) => total + debt.debts,
              0,
            )
            const totalToPay = (
              getValueViaPath<string[]>(application.answers, 'debtsToPay') ??
              []
            ).reduce((total, amount) => total + (parseInt(amount, 10) || 0), 0)

            return [
              {
                label: messages.table.totalToPayLabel,
                value: formatCurrency(totalToPay.toString()),
              },
              {
                label: messages.table.totalLeftLabel,
                value: formatCurrency((totalDebts - totalToPay).toString()),
              },
            ]
          },
        }),
      ],
    }),
  ],
})
