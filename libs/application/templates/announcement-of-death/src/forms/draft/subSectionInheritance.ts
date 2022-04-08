import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildTextField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { markdownOverrides } from '../../lib/markdownOverrides'
import { m } from '../../lib/messages'

export const subSectionInheritance = buildSubSection({
  id: 'inheritanceStep',
  title: 'Erfingjar',
  children: [
    buildMultiField({
      id: 'inheritanceTitle',
      title: 'Erfingjar',
      description: '',
      descriptionMarkdownOverrides: markdownOverrides,
      space: 1,
      children: [
        buildDescriptionField({
          id: 'membersOfEstateTitle',
          title: 'Aðilar dánarbús',
          space: 2,
          titleVariant: 'h4',
        }),
        buildCustomField({
          title: '',
          id: 'estateMembers',
          component: 'EstateMemberRepeater',
        }),
      ],
    }),
  ],
})
