import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { isCasualWork } from '../../utils/conditions'

export const casualWorkSection = buildSection({
  id: 'casualWorkSection',
  title: m.application.casualWorkHeading,
  condition: isCasualWork,
  children: [
    buildMultiField({
      id: 'casualWorkMultiField',
      title: m.application.casualWorkHeading,
      children: [
        buildDescriptionField({
          id: 'casualWorkDesc',
          description: m.application.casualWorkDescription,
        }),
        buildDescriptionField({
          id: 'casualWorkInfo',
          title: m.application.casualWorkInfoTitle,
          titleVariant: 'h5',
          description: m.application.casualWorkInfoBullets,
        }),
        buildFieldsRepeaterField({
          id: 'registerCasualWork',
          formTitleNumbering: 'suffix',
          formTitle: (_index, application) => {
            const items = getValueViaPath<Array<unknown>>(
              application.answers,
              'registerCasualWork',
            )
            if (!items || items.length <= 1) {
              return ''
            }
            return m.application.casualWorkHeading
          },
          addItemButtonText: m.application.addLine,
          minRows: 1,
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              searchPersons: false,
              required: true,
            },
            monthFrom: {
              component: 'date',
              label: m.application.monthFrom,
              width: 'half',
              required: true,
              clearOnChange: (index: number) => [
                `registerCasualWork[${index}].monthTo`,
              ],
              minDate: () => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
              },
            },
            monthTo: {
              component: 'date',
              label: m.application.monthTo,
              width: 'half',
              required: true,
              minDate: (_application, activeField) => {
                const fromDate = activeField?.monthFrom
                if (fromDate) {
                  return new Date(fromDate)
                }
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                return tomorrow
              },
            },
            estimatedIncome: {
              component: 'input',
              label: m.application.estimatedMonthlyIncome,
              width: 'half',
              type: 'number',
              currency: true,
              required: true,
              min: 0,
            },
          },
        }),
      ],
    }),
  ],
})
