import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'

export const relativesSubSection = buildSubSection({
  id: 'relativesSubSection',
  title: newPrimarySchoolMessages.childrenNGuardians.relativesSubSectionTitle,
  children: [
    buildMultiField({
      id: 'relatives',
      title: newPrimarySchoolMessages.childrenNGuardians.relativesTitle,
      description:
        newPrimarySchoolMessages.childrenNGuardians.relativesDescription,
      children: [
        buildCustomField({
          id: 'relatives',
          component: 'RelativesTableRepeater',
        }),
      ],
    }),
  ],
})
