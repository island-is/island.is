import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionProperties = buildSubSection({
  id: 'propertiesStep',
  title: 'Eignir',
  children: [
    buildMultiField({
      id: 'propertiesTitle',
      title: 'Eignir',
      description:
        'Hér skaltu lista niður upplýsingar um helstu eignir í dánarbúi. Eignir ber að tilkynna til Sýslumanns innan 30 daga frá dánardegi.',
      space: 1,
      children: [
        buildDescriptionField({
          id: 'realEstatesAndLandsTitle',
          title: 'Fasteignir og lóðir',
          titleVariant: 'h3',
          description: '',
        }),
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
          space: 3,
          titleVariant: 'h4',
          description: '',
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
          description: '',
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
