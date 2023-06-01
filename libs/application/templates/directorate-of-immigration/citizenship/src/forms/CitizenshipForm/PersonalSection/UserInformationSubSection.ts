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
          defaultValue: (application: Application) => {
          console.log('application', application)
            //application.externalData?.Individual?.data?.nationalId,
            return '0101704359'}
        }),
        buildTextField({
          id: 'userInformation.name',
          title: personal.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.individual?.data?.fullName,
        }),
        buildTextField({
          id: 'userInformation.address',
          title: personal.labels.userInformation.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.individual?.data?.address
              ?.streetAddress,
        }),
        buildTextField({
          id: 'userInformation.postalCode',
          title: personal.labels.userInformation.postalCodeAndCity,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.individual?.data?.address
              ?.postalCode +
            ' ' +
            application.externalData?.individual?.data?.address?.city,
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
            application.externalData?.individual?.data?.citizenship?.name
        }),
        buildTextField({
          id: 'userInformation.dateHomeRegistration',
          title: personal.labels.userInformation.dateHomeRegistration,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            '1.Apríl 2020'
        }),
        buildTextField({
          id: 'userInformation.birthCountry',
          title: personal.labels.userInformation.birthCountry,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            return application.externalData?.nationalRegistryBirthplace?.data
            ?.location
          }
            
        }),
      ],
    }),
  ],
})
