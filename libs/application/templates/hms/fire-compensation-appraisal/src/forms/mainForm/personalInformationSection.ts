import { buildSection } from '@island.is/application/core'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import * as m from '../../lib/messages'

export const personalInformationSection = buildSection({
  id: 'personalInformationSection',
  title: m.personalInformationMessages.title,
  condition: (answers) => {
    console.log('condition', answers)
    return true
  },
  children: [applicantInformationMultiField()],
})
