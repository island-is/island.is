import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildTextField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionInheritance = buildSubSection({
  id: 'inheritanceStep',
  title: 'Erfðir',
  children: [
    buildMultiField({
      id: 'inheritanceTitle',
      title: 'Erfðir',
      description:
        'Erfðaréttur byggist á frændsemi, ættleiðingu, hjúskap og erfðaskrá hins látna. Eignir hins látna renna til ríkissjóðs ef engir erfingjar eru til staðar.',
      space: 1,
      children: [
        buildKeyValueField({
          label: 'Erfðaskrá í vörslu sýslumanns',
          value: 'Já',
          width: 'half',
        }),
        buildKeyValueField({
          label: 'Kaupmáli',
          value: 'Nei',
          width: 'half',
        }),
        buildDescriptionField({
          id: 'knowledgeOfOtherWillsTitle',
          title: 'Vitneskja um aðra erfðaskrá',
          space: 2,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'knowledgeOfOtherWillsDescription',
          title: 'Lýsing',
          variant: 'textarea',
          backgroundColor: 'blue',
          placeholder:
            'Skráðu hér inn ef vitneskja er um erfðaskrá annars staðar',
        }),
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
