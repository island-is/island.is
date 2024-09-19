import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const relativesSubSection = buildSubSection({
  id: 'relativesSubSection',
  title: newPrimarySchoolMessages.childrenNParents.relativesSubSectionTitle,
  children: [
    buildMultiField({
      id: 'relatives',
      title: newPrimarySchoolMessages.childrenNParents.relativesTitle,
      description:
        newPrimarySchoolMessages.childrenNParents.relativesDescription,
      children: [
        buildCustomField({
          id: 'relatives',
          title: '',
          component: 'RelativesTableRepeater',
        }),
      ],
    }),
  ],
})
