import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { applicant } from '../../../lib/messages'
import { Application } from '../../../types/schema'

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
          id: 'name',
          title: applicant.labels.userInformation.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName,
        }),
        buildTextField({
          id: 'nationalId',
          title: applicant.labels.userInformation.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'address',
          title: applicant.labels.userInformation.address,
          backgroundColor: 'white',
          width: 'full',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.streetAddress,
        }),
        buildTextField({
          id: 'postalCode',
          title: applicant.labels.userInformation.postalcode,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode,
        }),
        buildTextField({
          id: 'city',
          title: applicant.labels.userInformation.city,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address?.city,
        }),
        buildTextField({
          id: 'birthPlace',
          title: applicant.labels.userInformation.birthPlace,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistryCustom?.data?.birthPlace,
        }),
        buildTextField({
          id: 'birthCountry',
          title: applicant.labels.userInformation.birthCountry,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.drivingLicense?.data?.birthCountry,
        }),
        buildDescriptionField({
          id: 'emailPhoneSubtitle',
          space: 3,
          title: applicant.labels.userInformation.emailPhoneSubtitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'email',
          title: applicant.labels.userInformation.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.email,
        }),
        buildTextField({
          id: 'phone',
          title: applicant.labels.userInformation.phone,
          width: 'half',
          variant: 'tel',
          required: true,
          defaultValue: (application: Application) =>
            application.externalData?.userProfile?.data?.phone,
        }),
        buildDescriptionField({
          id: 'qualityPhotoSubtitle',
          space: 3,
          title: applicant.labels.userInformation.qualityPhotoSubtitle,
          titleVariant: 'h5',
        }),
        buildCustomField({
          id: 'qualityPhoto',
          title: '',
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
          title: '',
          component: 'QualitySignature',
        }),
      ],
    }),
  ],
})
