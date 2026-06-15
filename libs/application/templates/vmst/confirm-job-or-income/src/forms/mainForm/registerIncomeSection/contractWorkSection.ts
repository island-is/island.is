import {
  buildAlertMessageField,
  buildTableRepeaterField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { isContractWork } from '../../../utils/conditions'

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
              minDate: () => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
              },
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
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
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
              contractJobStart: (value) => {
                if (!value) return ''
                const date = new Date(value)
                if (isNaN(date.getTime())) return value
                return date.toLocaleDateString('is-IS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              },
              workEnds: (value) => {
                if (!value) return ''
                const date = new Date(value)
                if (isNaN(date.getTime())) return value
                return date.toLocaleDateString('is-IS', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              },
            },
          },
        }),
      ],
    }),
  ],
})
