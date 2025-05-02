import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
  buildPhoneField,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'

export const userInformationSubSection = buildSubSection({
  id: 'userInformation',
  title: applicant.labels.userInformation.subSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: applicant.general.pageTitle,
      description: applicant.labels.userInformation.description,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: applicant.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName,
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: applicant.labels.userInformation.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'applicant.address',
          title: applicant.labels.userInformation.address,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.streetAddress,
        }),
        buildTextField({
          id: 'applicant.postalCode',
          title: applicant.labels.userInformation.postalcode,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode,
        }),
        buildTextField({
          id: 'applicant.city',
          title: applicant.labels.userInformation.city,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address?.city,
        }),
        buildTextField({
          id: 'applicant.birthPlace',
          title: applicant.labels.userInformation.birthPlace,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistryBirthplace?.data
              ?.location,
        }),
        buildTextField({
          id: 'applicant.birthCountry',
          title: applicant.labels.userInformation.birthCountry,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.currentLicense?.data?.birthCountry,
        }),
        buildDescriptionField({
          id: 'emailPhoneSubtitle',
          space: 3,
          title: applicant.labels.userInformation.emailPhoneSubtitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'applicant.email',
          title: applicant.labels.userInformation.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildPhoneField({
          id: 'applicant.phone',
          title: applicant.labels.userInformation.phone,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.mobilePhoneNumber,
          allowedCountryCodes: ['IS'],
          enableCountrySelector: false,
        }),
        buildDescriptionField({
          id: 'qualityPhotoSubtitle',
          space: 3,
          title: applicant.labels.userInformation.qualityPhotoSubtitle,
          titleVariant: 'h5',
        }),
        buildCustomField({
          id: 'qualityPhoto',
          component: 'QualityPhoto',
        }),
        buildDescriptionField({
          id: 'qualitySignatureSubtitle',
          space: 3,
          title: applicant.labels.userInformation.qualitySignatureSubtitle,
          titleVariant: 'h5',
        }),
        buildCustomField({
          id: 'qualitySignature',
          component: 'QualitySignature',
        }),
      ],
    }),
  ],
})
