import {
  buildAlertMessageField,
  buildCustomField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { GaldurExternalDomainModelsIncomeContractorJobDTO } from '@island.is/clients/vmst-unemployment'
import { uuid } from 'uuidv4'
import * as m from '../../../lib/messages'
import { isContractWork } from '../../../utils/conditions'
import {
  getCurrentMonthEndDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsDateLong } from '../../../utils/formatters'
import { IncomeValidationFieldProps } from '../../../fields/IncomeValidation'
import { IncomeValidationRow } from '../../../utils/validateIncomes'

const getContractWorkDefaults = (application: Application) => {
  const jobs =
    getValueViaPath<GaldurExternalDomainModelsIncomeContractorJobDTO[]>(
      application.externalData,
      'income.data.contractorJobs',
    ) ?? []

  return jobs.map((job) => ({
    validationId: job.id,
    contractJobStart: job.startDate ?? '',
    workEnds: job.endDate ?? '',
  }))
}

const contractWorkValidationProps: IncomeValidationFieldProps = {
  fieldId: 'registerContractWork',
  incomeTypeKey: 'contractorJobs',
  persistedPath: 'income.data.contractorJobs',
  callbackId: 'ContractWorkValidation',
  messages: {
    fallbackErrorMessage: 'contractWorkValidationErrorMessage',
  },
  rowToInput: (row: IncomeValidationRow) => ({
    validationId: String(row.validationId ?? ''),
    periodFrom: String(row.contractJobStart ?? ''),
    periodTo: String(row.workEnds ?? '') || undefined,
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
        buildTableRepeaterField({
          id: 'registerContractWork',
          addItemButtonText: m.application.addLine,
          hideTableHeaderIfEmpty: true,
          defaultValue: getContractWorkDefaults,
          fields: {
            contractJobStart: {
              component: 'date',
              label: m.application.jobStart,
              width: 'half',
              required: true,
              clearOnChange: (index: number) => [
                `registerContractWork[${index}].workEnds`,
              ],
              minDate: getCurrentMonthStartDate,
              maxDate: getCurrentMonthEndDate,
            },
            workEnds: {
              component: 'date',
              label: m.application.workEnds,
              width: 'half',
              required: true,
              minDate: (_application, activeField) => {
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
              defaultValue: (
                _application: Application,
                activeField?: Record<string, string>,
              ) => activeField?.validationId ?? uuid(),
            },
          },
          table: {
            header: [
              m.application.tableHeaderJobStart,
              m.application.tableHeaderWorkEnds,
            ],
            rows: ['contractJobStart', 'workEnds'],
            format: {
              contractJobStart: formatIsDateLong,
              workEnds: formatIsDateLong,
            },
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
