import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { personal } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

export const MaritalStatusSubSection = buildSubSection({
  id: 'maritalStatus',
  title: personal.labels.maritalStatus.subSectionTitle,
  children: [
    buildMultiField({
      id: 'maritalStatusMultiField',
      title: personal.labels.maritalStatus.pageTitle,
      description: personal.labels.maritalStatus.description,
      children: [
        buildDescriptionField({
          id: 'maritalStatus.title',
          title: personal.labels.maritalStatus.titleStatus,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'maritalStatus.status',
          title: personal.labels.maritalStatus.status,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistryMaritalTitle?.data
              ?.description,
        }),
        buildDescriptionField({
          id: 'maritalStatus.title',
          title: personal.labels.maritalStatus.titleSpouse,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'maritalStatus.nationalId',
          title: personal.labels.maritalStatus.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistrySpouse?.data?.nationalId,
        }),
        buildTextField({
          id: 'maritalStatus.name',
          title: personal.labels.maritalStatus.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistrySpouse?.data?.name,
        }),
      ],
    }),
  ],
})
