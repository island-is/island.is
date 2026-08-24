import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { StaticText } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { debts as messages } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'

type CustomerDebt = {
  chargeTypeName: string
  dueDate: string
  finalDueDate: string
  debts: number
}

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
        }),
        buildStaticTableField({
          header: [
            messages.table.chargeTypeNameHeader,
            messages.table.dueDateHeader,
            messages.table.finalDueDateHeader,
            messages.table.amountHeader,
          ],
          rows: (application) => {
            const debts =
              getValueViaPath<CustomerDebt[]>(
                application.externalData,
                'customerDebts.data.debts',
              ) ?? []

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
        }),
      ],
    }),
  ],
})
