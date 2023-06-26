import {
  buildMultiField,
  buildPhoneField,
  buildTextField,
} from '@island.is/application/core'

import { applicantInformation } from './messages'
import {
  ApplicantInformationInterface,
  applicantInformationProps,
} from './types'

export const applicantInformationMultiField = (
  props?: applicantInformationProps,
) => {
  // Phone required is default false for all applications
  // Email required is default true for all applications
  const { phoneRequired = false, emailRequired = true } = props ?? {}
  return buildMultiField({
    id: 'applicant',
    title: applicantInformation.general.title,
    children: [
      buildTextField({
        id: 'applicant.name',
        title: applicantInformation.labels.name,
        backgroundColor: 'white',
        disabled: true,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.fullName ??
          application.externalData?.identityRegistry?.data?.name ??
          '',
      }),
      buildTextField({
        id: 'applicant.nationalId',
        title: applicantInformation.labels.nationalId,
        format: '######-####',
        width: 'half',
        backgroundColor: 'white',
        disabled: true,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.nationalId ??
          application.externalData?.identityRegistry?.data?.nationalId ??
          '',
      }),
      buildTextField({
        id: 'applicant.address',
        title: applicantInformation.labels.address,
        width: 'half',
        backgroundColor: 'white',
        disabled: true,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.address
            ?.streetAddress ??
          application.externalData?.identityRegistry?.data?.address
            ?.streetAddress ??
          '',
      }),
      buildTextField({
        id: 'applicant.postalCode',
        title: applicantInformation.labels.postalCode,
        width: 'half',
        format: '###',
        backgroundColor: 'white',
        disabled: true,
        defaultValue: (application: ApplicantInformationInterface) => {
          return (
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode ??
            application.externalData?.identityRegistry?.data?.address
              ?.postalCode ??
            ''
          )
        },
      }),
      buildTextField({
        id: 'applicant.city',
        title: applicantInformation.labels.city,
        width: 'half',
        backgroundColor: 'white',
        disabled: true,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.address?.city ??
          application.externalData?.identityRegistry?.data?.address?.city ??
          '',
      }),
      buildTextField({
        id: 'applicant.email',
        title: applicantInformation.labels.email,
        width: 'half',
        variant: 'email',
        backgroundColor: 'blue',
        required: emailRequired,
        defaultValue: '',
        maxLength: 100,
      }),
      buildPhoneField({
        id: 'applicant.phoneNumber',
        title: applicantInformation.labels.tel,
        width: 'half',
        backgroundColor: 'blue',
        defaultValue: '',
        required: phoneRequired,
      }),
    ],
  })
}
