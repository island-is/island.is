import {
  buildDescriptionField,
  buildInteractiveTableField,
  buildMultiField,
  buildStickyFooterField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatCurrency } from '@island.is/shared/utils'

const invoices: {
  id: string
  name: string
  dueDate: string
  amount: number
  lines: { description: string; amount: number; invoiceUrl?: string }[]
  info?: string
}[] = [
  {
    id: 'invoice-1',
    name: 'Invoice 1 - Annual inspection fee for a passenger car',
    dueDate: '15.01.2024',
    amount: 25000,
    lines: [
      { description: 'Base fee', amount: 20000 },
      { description: 'Interest', amount: 5000 },
    ],
    info: 'This invoice is already being deducted from your salary. Let your employer know if you pay it off here.',
  },
  {
    id: 'invoice-2',
    name: 'Invoice 2',
    dueDate: '15.02.2024',
    amount: 12500,
    lines: [{ description: 'Base fee', amount: 12500 }],
  },
  {
    id: 'invoice-3',
    name: 'Invoice 3',
    dueDate: '15.03.2024',
    amount: 8000,
    lines: [],
  },
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
            'The interactive table lets users select rows and, optionally, enter an amount per row capped by a max value - for example choosing which invoices to pay and how much to pay towards each one. Pair it with a sticky footer field (referencing the table via widthReferenceTestId/watchFieldIds) to show a live running total as the user edits values. A column marked expandable turns into a chevron toggle that opens the row into a sub-table defined by expandedRows; rows with no sub-table entries stay closed. Pass expandedRows.info to add an optional message below the sub-table of a given row. A header cell can also be truncated to one line with the full text on hover (truncate), carry a hover hint (tooltip), or, in the expanded sub-table, be a link column (link) whose cell value, a URL, becomes a button that opens it in a new tab through the BFF, which only accepts URLs on its BFF_ALLOWED_EXTERNAL_API_URLS list (locally the download service at localhost:3377/download/v1); an empty value shows nothing, as in this example, which has no real documents to link to. rowIds stores a stable id per row (here under interactiveTableRowIds) so answers survive when the list changes, and isSubmitDisabled disables the submit button until at least one row is selected. title and titleVariant set a heading above the table.',
          marginBottom: 2,
        }),
        buildInteractiveTableField({
          id: 'interactiveTableSelectedRows',
          dataTestId: 'interactive-table',
          title: 'Invoices',
          titleVariant: 'h5',
          selectable: true,
          header: [
            { label: 'Invoice', width: 200, expandable: true, truncate: true },
            {
              label: 'Due date',
              tooltip: 'The date the invoice must be paid by',
            },
            'Amount due',
            'Amount to pay',
          ],
          rows: invoices.map((invoice) => [
            invoice.name,
            invoice.dueDate,
            formatCurrency(invoice.amount.toString()),
          ]),
          expandedRows: {
            header: [
              'Description',
              'Amount',
              { label: 'Invoice', link: true, width: 100 },
            ],
            rows: invoices.map((invoice) =>
              invoice.lines.map((line) => [
                line.description,
                formatCurrency(line.amount.toString()),
                line.invoiceUrl ?? '',
              ]),
            ),
            info: invoices.map((invoice) => invoice.info),
          },
          inputColumn: {
            id: 'interactiveTableAmountToPay',
            getMaxAmount: () => invoices.map((invoice) => invoice.amount),
            placeholder: 'kr.',
          },
          rowIds: {
            id: 'interactiveTableRowIds',
            getIds: () => invoices.map((invoice) => invoice.id),
          },
          isSubmitDisabled: ({ selectedRows }) => !selectedRows.some(Boolean),
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
          labelMinWidth: 160,
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
