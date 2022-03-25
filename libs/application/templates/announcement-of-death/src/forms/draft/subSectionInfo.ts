import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '../../types/schema'

export const subSectionInfo = buildSubSection({
  id: 'infoStep',
  title: 'Tilkynnandi',
  children: [
    buildMultiField({
      id: 'announcement',
      title: 'Tilkynnandi',
      description:
        'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
      space: 1,
      children: [
        buildTextField({
          id: 'applicantName',
          title: 'Nafn',
          placeholder: '',
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName ?? '',
        }),
        buildTextField({
          id: 'applicantPhone',
          title: 'Símanúmer',
          placeholder: '',
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.mobilePhoneNumber ??
            '',
        }),
        buildTextField({
          id: 'applicantEmail',
          title: 'Netfang',
          placeholder: '',
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email ?? '',
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
