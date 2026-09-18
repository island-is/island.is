import {
  buildAlertMessageField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isContractWork } from '../../../utils/conditions'
import {
  getCurrentMonthEndDate,
  getCurrentMonthStartDate,
} from '../../../utils/date'
import { formatIsDateLong } from '../../../utils/formatters'

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
          initActiveFieldIfEmpty: true,
          hideTableHeaderIfEmpty: true,
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
      ],
    }),
  ],
})
