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
      description: messages.description.description,
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
          pageSize: 50,
          header: [
            {
              label: messages.table.chargeTypeNameHeader,
              expandable: true,
              truncate: true,
              width: 200,
            },
            {
              label: messages.table.chargeItemSubjectHeader,
              tooltip: messages.table.chargeItemSubjectHeaderTooltip,
              truncate: true,
              width: 90,
            },
            { label: messages.table.finalDueDateHeader, width: 120 },
            { label: messages.table.amountHeader, width: 120 },
            messages.table.toPayLabel,
          ],
          rows: (application) =>
            getDebts(application).map<StaticText[]>((debt) => [
              debt.chargeTypeName,
              debt.chargeItemSubject,
              debt.finalDueDate,
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
                  debt.dueDate,
                  debt.timePeriod,
                  formatCurrency(debt.principal),
                  formatCurrency(debt.interest),
                  formatCurrency(debt.cost),
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
          condition: hasDebtsToPay,
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
