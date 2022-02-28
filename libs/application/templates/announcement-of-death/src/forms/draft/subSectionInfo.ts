import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionInfo = buildSubSection({
  id: 'infoStep',
  title: 'Tilkynning',
  children: [
    buildMultiField({
      id: 'announcement',
      title: 'Upplýsingar',
      description:
        'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
      space: 1,
      children: [
        buildDescriptionField({
          id: 'hinnLatniTitle',
          title: 'Hinn látni',
          titleVariant: 'h4',
          description: '',
        }),
        buildTextField({
          id: 'deceasedName',
          title: 'Nafn',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildTextField({
          id: 'deceasedNationalId',
          title: 'Kennitala',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildTextField({
          id: 'deceasedDateAnnouned',
          title: 'Tilkynnt dags',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildTextField({
          id: 'deceasedMaritalStatus',
          title: 'Hjúskaparstaða',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildDescriptionField({
          id: 'tilkynnandiTitle',
          title: 'Tilkynnandi',
          space: 5,
          titleVariant: 'h4',
          description: '',
        }),
        buildTextField({
          id: 'applicantName',
          title: 'Nafn',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildTextField({
          id: 'applicantNationalId',
          title: 'Kennitala',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildTextField({
          id: 'applicantAnnouncementDate',
          title: 'Tilkynnt dags',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          disabled: true,
        }),
        buildTextField({
          id: 'applicantPhone',
          title: 'Símanúmer',
          placeholder: '',
          width: 'half',
        }),
        buildTextField({
          id: 'applicantEmail',
          title: 'Netfang',
          placeholder: '',
          width: 'half',
        }),
        buildSelectField({
          id: 'applicantRelation',
          title: 'Tengsl',
          placeholder: 'Veldu tengsl',
          width: 'half',
          options: [
            {
              label: 'Option 1',
              value: 'Option 1',
            },
            {
              label: 'Option 2',
              value: 'Option 2',
            },
            {
              label: 'Option 3',
              value: 'Option 3',
            },
          ],
        }),
      ],
    }),
  ],
})
