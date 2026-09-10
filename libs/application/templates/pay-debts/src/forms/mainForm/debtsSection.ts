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
import {
  getDebts,
  getDebtsFromExternalData,
  hasFetchedDebts,
} from '../../utils/getDebts'
import { formatDate } from '../../utils/formatDate'

const dueDateOrNothing = (date: string): StaticText =>
  formatDate(date) ?? messages.table.noDateLabel

const hasDebtsToPay = (_answers: unknown, externalData: ExternalData) =>
  hasFetchedDebts(externalData) &&
  getDebtsFromExternalData(externalData).length > 0

export const debtsSection = buildSection({
  id: 'debtsSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'debtsSection',
      title: messages.general.sectionTitle,
      description: messages.general.description,
      nextButtonText: messages.general.nextButtonText,
      children: [
        buildCustomField({
          id: 'debtsLoader',
          component: 'DebtsLoader',
          doesNotRequireAnswer: true,
        }),
        buildInteractiveTableField({
          id: 'selectedDebts',
          condition: hasDebtsToPay,
          dataTestId: 'debts-table',
          selectable: true,
          header: [
            {
              label: messages.table.chargeTypeNameHeader,
              expandable: true,
              truncate: true,
            },
            {
              label: messages.table.chargeItemSubjectHeader,
              truncate: true,
            },
            {
              label: messages.table.finalDueDateHeader,
            },
            {
              label: messages.table.amountHeader,
              width: 110,
            },
            // { label: messages.table.toPayLabel, width: 140 },
          ],
          rows: (application) =>
            getDebts(application).map<StaticText[]>((debt) => [
              debt.chargeTypeName,
              debt.chargeItemSubject,
              dueDateOrNothing(debt.finalDueDate),
              formatCurrency(debt.debts),
            ]),
          expandedRows: {
            header: [
              messages.table.dueDateHeader,
              messages.table.timePeriodHeader,
              messages.table.principalHeader,
              messages.table.interestHeader,
              messages.table.costHeader,
            ],
            rows: (application) =>
              getDebts(application).map<StaticText[][]>((debt) => [
                [
                  dueDateOrNothing(debt.dueDate),
                  debt.timePeriod,
                  formatCurrency(debt.principal),
                  formatCurrency(debt.interest),
                  formatCurrency(debt.cost),
                ],
              ]),
          },
          // inputColumn: {
          //   id: 'debtsToPay',
          //   getMaxAmount: (application) =>
          //     getDebts(application).map((debt) => debt.debts),
          // },
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
          condition: hasDebtsToPay,
          widthReferenceTestId: 'debts-table',
          // watchFieldIds: ['debtsToPay', 'selectedDebts'],
          watchFieldIds: ['selectedDebts'],
          labelOffset: 56,
          labelMinWidth: 180,
          rows: (application: Application) => {
            const debts = getDebts(application)
            const selected =
              getValueViaPath<boolean[]>(
                application.answers,
                'selectedDebts',
              ) ?? []

            const totalDebts = debts.reduce(
              (total, debt) => total + debt.debts,
              0,
            )
            // While partial payments are hidden, a selected row is always paid
            // in full. Once `inputColumn` comes back, this becomes:
            // const totalToPay = (
            //   getValueViaPath<string[]>(application.answers, 'debtsToPay') ?? []
            // ).reduce((total, amount) => total + (parseInt(amount, 10) || 0), 0)
            const totalToPay = debts.reduce(
              (total, debt, index) =>
                selected[index] ? total + debt.debts : total,
              0,
            )

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
