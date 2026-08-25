import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
} from '@island.is/application/core'
import { StaticText } from '@island.is/application/types'
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
      ],
    }),
  ],
})
