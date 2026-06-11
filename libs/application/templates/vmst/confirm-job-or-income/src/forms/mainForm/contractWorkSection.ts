import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { isContractWork } from '../../utils/conditions'

export const contractWorkSection = buildSection({
  id: 'contractWorkSection',
  title: m.application.contractWorkHeading,
  condition: isContractWork,
  children: [
    buildMultiField({
      id: 'contractWorkMultiField',
      title: m.application.contractWorkHeading,
      children: [
        buildDescriptionField({
          id: 'contractWorkDesc',
          description: m.application.contractWorkDescription,
        }),
        buildAlertMessageField({
          id: 'contractWorkAlert',
          title: m.application.contractWorkAlertTitle,
          message: m.application.contractWorkAlert,
          alertType: 'info',
        }),
        buildFieldsRepeaterField({
          id: 'registerContractWork',
          formTitleNumbering: 'suffix',
          formTitle: (index, application) => {
            const items = getValueViaPath<Array<unknown>>(
              application.answers,
              'registerContractWork',
            )
            if (!items || items.length <= 1) {
              return ''
            }
            return {
              ...m.application.contractWorkHeading,
              values: { index: index + 1 },
            }
          },
          addItemButtonText: m.application.addLine,
          minRows: 1,
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
        }),
      ],
    }),
  ],
})
