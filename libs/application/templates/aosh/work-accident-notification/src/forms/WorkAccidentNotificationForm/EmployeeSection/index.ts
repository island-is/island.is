import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'
import { employeeSubSection } from './employee'
import { FormValue } from '@island.is/application/types'
import { WorkAccidentNotification } from '../../..'

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
    condition: (formValue: FormValue) => {
      const answers = formValue as WorkAccidentNotification
      return index < answers.employeeAmount || index === 0
    },
  })
