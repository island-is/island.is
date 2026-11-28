import {
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { isContractWork } from '../../../utils/conditions'
import {
  getMaxRegistrationDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsDate } from '../../../utils/formatters'
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import { buildIncomeDescriptionFields } from './incomeDescriptionFields'
import { buildPersistedRowProps } from '../../../utils/reconcile'
import {
  getContractWorkDefaults,
  toContractWorkRow,
} from '../../../utils/persistedRows'
import { toOptionalString, toRequiredString } from '../../../utils/rowCoercions'

const contractWorkValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerContractWork',
  incomeTypeKey: 'contractorJobs',
  persistedPath: 'income.data.contractorJobs',
  toRow: toContractWorkRow,
  callbackId: 'ContractWorkValidation',
  messages: {
    fallbackErrorMessage: 'contractWorkValidationErrorMessage',
  },
  rowToInput: (row) => ({
    validationId: toRequiredString(row.validationId),
    periodFrom: toRequiredString(row.contractJobStart),
    periodTo: toOptionalString(row.workEnds),
  }),
}

export const contractWorkSection = buildSubSection({
  id: 'contractWorkSection',
  title: m.application.contractWorkHeading,
  condition: isContractWork,
  children: [
    buildMultiField({
      id: 'contractWorkMultiField',
      title: m.application.contractWorkHeading,
      description: m.application.contractWorkDescription,
      children: [
        buildAlertMessageField({
          id: 'contractWorkAlert',
          title: m.application.contractWorkAlertTitle,
          message: m.application.contractWorkAlert,
          alertType: 'info',
        }),
        ...buildIncomeDescriptionFields('contractWorkDescription'),
        buildTableRepeaterField({
          id: 'registerContractWork',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getContractWorkDefaults,
          removeButtonDisabledTooltipText: m.application.removeLineNotAllowed,
          editField: true,
          editButtonDisabledTooltipText: m.application.editLineNotAllowed,
          marginTop: 2,
          fields: {
            contractJobStart: {
              component: 'date',
              label: m.application.jobStart,
              width: 'half',
              required: true,
              clearOnChange: ({ index }) => [
                `registerContractWork[${index}].workEnds`,
              ],
              minDate: () => getCurrentMonthStartDate(),
              maxDate: () => getMaxRegistrationDate(),
            },
            workEnds: {
              component: 'date',
              label: m.application.workEnds,
              width: 'half',
              required: true,
              maxDate: () => getMaxRegistrationDate(),
              minDate: ({ row: activeField }) => {
                const fromDate = activeField?.contractJobStart
                if (fromDate) {
                  return new Date(fromDate)
                }
                return getCurrentMonthStartDate()
              },
            },
            // Correlates each row with the 3rd party validation response.
            // Reuses an existing id (persisted or previously minted) so this
            // function stays idempotent across renders.
            validationId: {
              component: 'hiddenInput',
              defaultValue: ({ row: activeField }) =>
                activeField?.validationId ?? uuid(),
            },
          },
          table: {
            columns: [
              {
                header: m.application.tableHeaderJobStart,
                value: ({ row }) => formatIsDate(row.contractJobStart ?? ''),
              },
              {
                header: m.application.tableHeaderWorkEnds,
                value: ({ row }) => formatIsDate(row.workEnds ?? ''),
              },
            ],
            rowProps: buildPersistedRowProps(
              contractWorkValidationProps.persistedPath,
            ),
          },
        }),
        buildCustomField(
          {
            id: 'contractWorkValidation',
            doesNotRequireAnswer: true,
            component: 'IncomeValidation',
          },
          contractWorkValidationProps,
        ),
      ],
    }),
  ],
})
