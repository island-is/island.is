import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { GeneralFishingLicense } from '../../lib/dataSchema'

import { applicantInformation } from '../../lib/messages'

export const applicantInformationSection = buildSection({
  id: 'applicantInformationSection',
  title: applicantInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicant',
      title: applicantInformation.general.title,
      description: applicantInformation.general.description,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: applicantInformation.labels.name,
          backgroundColor: 'white',
          disabled: true,
          required: true,
          defaultValue: (application: GeneralFishingLicense) => {
            const company =
              application.externalData.companyNationalRegistry.data.name
            if (company) {
              return application.externalData.companyNationalRegistry.data.name
            }
            return application.externalData?.companyNationalRegistry?.data
              ?.fullName
          },
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: applicantInformation.labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          required: true,
          defaultValue: (application: GeneralFishingLicense) =>
            application.externalData?.companyNationalRegistry?.data?.nationalId,
        }),
        buildTextField({
          id: 'applicant.address',
          title: applicantInformation.labels.address,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          required: true,
          defaultValue: (application: GeneralFishingLicense) => {
            const company =
              application.externalData.companyNationalRegistry.data.name
            if (company) {
              return application.externalData.companyNationalRegistry.data
                .companyInfo?.address?.streetAddress
            }
            return application.externalData?.companyNationalRegistry?.data
              ?.address?.streetAddress
          },
        }),
        buildTextField({
          id: 'applicant.postalCode',
          title: applicantInformation.labels.postalCode,
          width: 'half',
          format: '###',
          backgroundColor: 'white',
          disabled: true,
          required: true,
          defaultValue: (application: GeneralFishingLicense) => {
            const type =
              application.externalData.companyNationalRegistry.data.type
            if (type === 'company') {
              return application.externalData.companyNationalRegistry.data
                .companyInfo?.address?.postalCode
            }
            return (
              application.externalData?.companyNationalRegistry?.data?.address
                ?.postalCode || '105'
            )
          },
        }),
        buildTextField({
          id: 'applicant.city',
          title: applicantInformation.labels.city,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          required: true,
          defaultValue: (application: GeneralFishingLicense) => {
            const company =
              application.externalData.companyNationalRegistry.data.name
            if (company) {
              return application.externalData.companyNationalRegistry.data
                .companyInfo?.address?.locality
            }
            return application.externalData?.companyNationalRegistry?.data
              ?.address?.city
          },
        }),
        buildTextField({
          id: 'applicant.email',
          title: applicantInformation.labels.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: '',
          maxLength: 100,
        }),
        buildTextField({
          id: 'applicant.phoneNumber',
          title: applicantInformation.labels.tel,
          format: '###-####',
          width: 'half',
          variant: 'tel',
          defaultValue: '',
        }),
      ],
    }),
  ],
})
