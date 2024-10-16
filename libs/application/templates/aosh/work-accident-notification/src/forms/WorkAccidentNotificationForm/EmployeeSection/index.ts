import { buildSection, getValueViaPath } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'
import { employeeSubSection } from './employee'
import { Application, FormValue } from '@island.is/application/types'
import { WorkAccidentNotification } from '../../../lib/dataSchema'

export const employeeSection = (index: number) =>
  buildSection({
    id: `employeeSection ${index}`,
    title: () => {
      return {
        ...sections.draft.employee,
        values: {
          number: index + 1,
        },
      }
    },
    children: [employeeSubSection(index)],
    condition: (formValue: FormValue, externalData, user) => {
      const answers = formValue as WorkAccidentNotification
      return index < answers.employeeAmount
    },
  })
