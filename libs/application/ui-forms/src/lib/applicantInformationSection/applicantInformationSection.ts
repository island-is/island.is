import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'

import { applicantInformation } from './messages'

export const applicantInformationSection = buildSection({
  id: 'informationAboutApplicantSection',
  title: applicantInformation.general.title,
  children: [
    buildMultiField({
      id: 'applicant',
      title: applicantInformation.general.title,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: applicantInformation.labels.name,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.fullName ?? '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: applicantInformation.labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.nationalId ?? '',
        }),
        buildTextField({
          id: 'applicant.address',
          title: applicantInformation.labels.address,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.streetAddress ?? '',
        }),
        buildTextField({
          id: 'applicant.postalCode',
          title: applicantInformation.labels.postalCode,
          width: 'half',
          format: '###',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) => {
            return (
              application.externalData?.nationalRegistry?.data?.address
                ?.postalCode ?? ''
            )
          },
        }),
        buildTextField({
          id: 'applicant.city',
          title: applicantInformation.labels.city,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: Application) =>
            application.externalData?.nationalRegistry?.data?.address?.city ??
            '',
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
