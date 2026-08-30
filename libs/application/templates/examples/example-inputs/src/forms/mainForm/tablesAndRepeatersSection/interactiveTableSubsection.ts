import {
  buildDescriptionField,
  buildInteractiveTableField,
  buildMultiField,
  buildStickyFooterField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'

const invoices = [
  { name: 'Invoice 1', dueDate: '15.01.2024', amount: 25000 },
  { name: 'Invoice 2', dueDate: '15.02.2024', amount: 12500 },
  { name: 'Invoice 3', dueDate: '15.03.2024', amount: 8000 },
]

export const interactiveTableSubsection = buildSubSection({
  id: 'interactiveTableSubsection',
  title: 'Interactive table',
  children: [
    buildMultiField({
      id: 'interactiveTableMultiField',
      title: 'Interactive table field',
      children: [
        buildDescriptionField({
          id: 'interactiveTableDescription',
          description:
            'The interactive table lets users select rows and, optionally, enter an amount per row capped by a max value - for example choosing which invoices to pay and how much to pay towards each one. Pair it with a sticky footer field (referencing the table via widthReferenceTestId/watchFieldIds) to show a live running total as the user edits values.',
          marginBottom: 2,
        }),
        buildInteractiveTableField({
          id: 'interactiveTableSelectedRows',
          dataTestId: 'interactive-table',
          selectable: true,
          header: [
            { label: 'Invoice', width: 200 },
            'Due date',
            'Amount due',
            'Amount to pay',
          ],
          rows: invoices.map((invoice) => [
            invoice.name,
            invoice.dueDate,
            formatCurrency(invoice.amount.toString()),
          ]),
          inputColumn: {
            id: 'interactiveTableAmountToPay',
            getMaxAmount: () => invoices.map((invoice) => invoice.amount),
            placeholder: 'kr.',
          },
          footerRow: [
            'Total',
            '',
            formatCurrency(
              invoices
                .reduce((sum, invoice) => sum + invoice.amount, 0)
                .toString(),
            ),
          ],
        }),
        buildStickyFooterField({
          id: 'interactiveTableStickyFooter',
          widthReferenceTestId: 'interactive-table',
          watchFieldIds: [
            'interactiveTableAmountToPay',
            'interactiveTableSelectedRows',
          ],
          labelOffset: 56,
          labelWidth: 160,
          rows: (application: Application) => {
            const amountsToPay =
              getValueViaPath<string[]>(
                application.answers,
                'interactiveTableAmountToPay',
              ) ?? []
            const totalToPay = amountsToPay.reduce(
              (sum, amount) => sum + (parseInt(amount, 10) || 0),
              0,
            )
            const totalAvailable = invoices.reduce(
              (sum, invoice) => sum + invoice.amount,
              0,
            )

            return [
              {
                label: 'Selected total',
                value: formatCurrency(totalToPay.toString()),
              },
              {
                label: 'Remaining',
                value: formatCurrency((totalAvailable - totalToPay).toString()),
              },
            ]
          },
        }),
      ],
    }),
  ],
})
