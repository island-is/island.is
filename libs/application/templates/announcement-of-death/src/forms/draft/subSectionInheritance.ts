import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionInheritance = buildSubSection({
  id: 'inheritanceStep',
  title: m.inheritanceTitle,
  children: [
    buildMultiField({
      id: 'inheritanceTitle',
      title: m.inheritanceTitle,
      description: m.inheritanceDescription,
      space: 1,
      children: [
        buildDescriptionField({
          id: 'membersOfEstateTitle',
          title: m.inheritanceMembersOfEstateTitle,
          space: 2,
          titleVariant: 'h3',
        }),
        buildCustomField({
          title: '',
          id: 'estateMembers',
          component: 'EstateMemberRepeater',
          childInputIds: ['estateMembers.encountered', 'estateMembers.members'],
        }),
      ],
    }),
  ],
})
