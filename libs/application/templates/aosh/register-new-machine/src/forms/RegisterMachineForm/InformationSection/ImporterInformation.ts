import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  //   buildDescriptionField,
  buildPhoneField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

export const ImporterInformationSubSection = buildSubSection({
  id: 'importerInformation',
  title: information.labels.importer.sectionTitle,
  children: [
    buildMultiField({
      id: 'importerInformationMultiField',
      title: information.labels.importer.title,
      description: information.labels.importer.description,
      children: [
        // buildDescriptionField({
        //   id: 'importerInformation.mainSeller',
        //   title: information.labels.importer.subtitle,
        //   titleVariant: 'h5',
        // }),
        buildTextField({
          id: 'importerInformation.name',
          title: information.labels.importer.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.name,
        }),
        buildTextField({
          id: 'importerInformation.nationalId',
          title: information.labels.importer.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'importerInformation.address',
          title: information.labels.importer.address,
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'importerInformation.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildPhoneField({
          id: 'importerInformation.phone',
          title: information.labels.importer.phone,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.phone,
        }),
        buildTextField({
          id: 'importerInformation.email',
          title: information.labels.importer.email,
          width: 'half',
          variant: 'email',
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
      ],
    }),
  ],
})
