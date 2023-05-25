import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { personal } from '../../../lib/messages'
import { Application, NationalRegistryUser } from '@island.is/api/schema'

export const UserInformationSubSection = buildSubSection({
  id: 'userInformation',
  title: personal.labels.userInformation.subSectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: personal.labels.userInformation.pageTitle,
      description: personal.labels.userInformation.description,
      children: [
        buildDescriptionField({
          id: 'userInformation.title',
          title: personal.labels.userInformation.title,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'userInformation.nationalId',
          title: personal.labels.userInformation.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'userInformation.name',
          title: personal.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName,
        }),
        buildTextField({
          id: 'userInformation.address',
          title: personal.labels.userInformation.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.streetAddress,
        }),
        buildTextField({
          id: 'userInformation.postalCode',
          title: personal.labels.userInformation.postalCodeAndCity,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode +
            ' ' +
            application.externalData?.nationalRegistry?.data?.address?.city,
        }),
        buildTextField({
          id: 'userInformation.email',
          title: personal.labels.userInformation.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildTextField({
          id: 'userInformation.phone',
          title: personal.labels.userInformation.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.phone,
        }),
        buildTextField({
          id: 'userInformation.citizenship',
          title: personal.labels.userInformation.citizenship,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.citizenship?.name
        }),
        // buildTextField({
        //   id: 'userInformation.dateHomeRegistration',
        //   title: personal.labels.userInformation.dateHomeRegistration,
        //   backgroundColor: 'white',
        //   width: 'half',
        //   readOnly: true,
        //   defaultValue: (application: Application) =>
        //     application.externalData?.nationalRegistry?.data?.citizenship?.date
        // }),
        buildTextField({
          id: 'userInformation.birthCountry',
          title: personal.labels.userInformation.birthCountry,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            console.log('application', application)
            return application.externalData?.nationalRegistryBirthplace?.data
            ?.location
          }
            
        }),
      ],
    }),
  ],
})
