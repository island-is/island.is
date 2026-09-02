import {
  buildCustomField,
  buildHiddenInput,
  buildInteractiveTableField,
  buildMultiField,
  buildSection,
  buildStickyFooterField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  ExternalData,
  StaticText,
} from '@island.is/application/types'
import { formatCurrency, isRunningOnEnvironment } from '@island.is/shared/utils'
import { debts as messages } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'
import { formatTimePeriod } from '../../utils/formatTimePeriod'
import { getDebts, hasFetchedDebts } from '../../utils/getDebts'

const PRINCIPAL_AND_INTEREST_UNAVAILABLE = '—'

const debtsWereFetched = (_answers: unknown, externalData: ExternalData) =>
  hasFetchedDebts(externalData)

export const debtsSection = buildSection({
  id: 'debtsSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'debtsSection',
      title: messages.general.sectionTitle,
      description: messages.description.description,
      children: [
        buildCustomField({
          id: 'debtsLoader',
          component: 'DebtsLoader',
          doesNotRequireAnswer: true,
        }),
        buildInteractiveTableField({
          id: 'selectedDebts',
          condition: debtsWereFetched,
          dataTestId: 'debts-table',
          selectable: true,
          header: [
            {
              label: messages.table.chargeTypeNameHeader,
              expandable: true,
            },
            {
              label: messages.table.chargeItemSubjectHeader,
              truncate: true,
              width: 150,
            },
            { label: messages.table.timePeriodHeader, width: 110 },
            { label: messages.table.amountHeader, width: 120 },
            messages.table.toPayLabel,
          ],
          rows: (application) => {
            const debts = getDebts(application)

            if (debts.length === 0) {
              return [[messages.table.emptyMessage, '', '', '']]
            }

            return debts.map<StaticText[]>((debt) => [
              debt.chargeTypeName,
              debt.chargeItemSubject,
              formatTimePeriod(debt.timePeriod),
              formatCurrency(debt.debts),
            ])
          },
          expandedRows: {
            header: [
              messages.table.dueDateHeader,
              messages.table.finalDueDateHeader,
              messages.table.principalHeader,
              messages.table.interestHeader,
            ],
            rows: (application) =>
              getDebts(application).map<StaticText[][]>((debt) => [
                [
                  formatDate(debt.dueDate),
                  formatDate(debt.finalDueDate),
                  PRINCIPAL_AND_INTEREST_UNAVAILABLE,
                  PRINCIPAL_AND_INTEREST_UNAVAILABLE,
                ],
              ]),
          },
          inputColumn: {
            id: 'debtsToPay',
            getMaxAmount: (application) =>
              getDebts(application).map((debt) => debt.debts),
          },
          isSubmitDisabled: ({ selectedRows }) => !selectedRows.some(Boolean),
          footerRow: (application) => [
            messages.table.totalDebtsLabel,
            '',
            '',
            formatCurrency(
              getDebts(application).reduce(
                (total, debt) => total + debt.debts,
                0,
              ),
            ),
          ],
        }),
        buildStickyFooterField({
          id: 'debtsSummaryFooter',
          condition: debtsWereFetched,
          widthReferenceTestId: 'debts-table',
          watchFieldIds: ['debtsToPay', 'selectedDebts'],
          rows: (application: Application) => {
            const totalDebts = getDebts(application).reduce(
              (total, debt) => total + debt.debts,
              0,
            )
            const totalToPay = (
              getValueViaPath<string[]>(application.answers, 'debtsToPay') ?? []
            ).reduce((total, amount) => total + (parseInt(amount, 10) || 0), 0)

            return [
              {
                label: messages.table.totalToPayLabel,
                value: formatCurrency(totalToPay),
              },
              {
                label: messages.table.totalLeftLabel,
                value: formatCurrency(totalDebts - totalToPay),
              },
            ]
          },
        }),
        buildHiddenInput({
          id: 'shouldUseMockPayment',
          defaultValue: true,
          condition: () =>
            isRunningOnEnvironment('dev') || isRunningOnEnvironment('local'),
        }),
      ],
    }),
  ],
})
