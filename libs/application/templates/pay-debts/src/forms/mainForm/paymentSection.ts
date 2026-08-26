import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
} from '@island.is/application/core'
import { StaticText } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { debts, payment as messages } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'
import { getSelectedDebts } from '../../utils/getSelectedDebts'

export const paymentSection = buildSection({
  id: 'paymentSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentSection',
      title: messages.description.title,
      children: [
        buildDescriptionField({
          id: 'description',
          description: messages.description.description,
          space: 'none',
        }),
        buildStaticTableField({
          header: [
            debts.table.chargeTypeNameHeader,
            debts.table.dueDateHeader,
            debts.table.finalDueDateHeader,
            debts.table.toPayLabel,
          ],
          rows: (application) =>
            getSelectedDebts(application).map<StaticText[]>((debt) => [
              debt.chargeTypeName,
              formatDate(debt.dueDate),
              formatDate(debt.finalDueDate),
              formatCurrency(debt.amountToPay.toString()),
            ]),
          summary: (application) => [
            {
              label: messages.summary.totalLabel,
              value: formatCurrency(
                getSelectedDebts(application)
                  .reduce((total, debt) => total + debt.amountToPay, 0)
                  .toString(),
              ),
            },
          ],
        }),
      ],
    }),
  ],
})
