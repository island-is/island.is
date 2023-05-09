import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

export const MaritalStatusSubSection = buildSubSection({
  id: 'maritalStatus',
  title: information.labels.maritalStatus.subSectionTitle,
  children: [
    buildMultiField({
      id: 'maritalStatusMultiField',
      title: information.labels.maritalStatus.pageTitle,
      description: information.labels.maritalStatus.description,
      children: [
        buildDescriptionField({
          id: 'maritalStatus.title',
          title: information.labels.maritalStatus.titleStatus,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'maritalStatus.status',
          title: information.labels.maritalStatus.status,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => 'Giftur',
        }),
        buildDescriptionField({
          id: 'maritalStatus.title',
          title: information.labels.maritalStatus.titleSpouse,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'maritalStatus.nationalId',
          title: information.labels.maritalStatus.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => '0123456789',
        }),
        buildTextField({
          id: 'maritalStatus.name',
          title: information.labels.maritalStatus.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => 'Jane Smith',
        }),
      ],
    }),
  ],
})
