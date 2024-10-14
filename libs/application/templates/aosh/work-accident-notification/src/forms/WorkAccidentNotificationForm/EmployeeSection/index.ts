import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'
import { employeeSubSection } from './employee'
import { FormValue } from '@island.is/application/types'

export const employeeSection = (index: number) =>
  buildSection({
    id: `employeeSection ${index}`,
    title: sections.draft.employee,
    children: [employeeSubSection],
    condition: (formValue: FormValue, externalData, user) => {
      // TODO Nonsense condition for testing,
      // Potentially could look into answers here to determine if this section should be displayed i.e employee nr. x
      return index === 0
    },
  })
