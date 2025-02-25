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
  // Email disabled is default false for all applications
  // Option to add description
  const {
    phoneCondition,
    phoneRequired = false,
    phoneDisabled = false,
    phoneEnableCountrySelector,
    emailCondition,
    emailRequired = true,
    emailDisabled = false,
    applicantInformationDescription = '',
    readOnly = false,
  } = props ?? {}
  return buildMultiField({
    id: 'applicant',
    title: applicantInformation.general.title,
    description: applicantInformationDescription,
    children: [
      buildTextField({
        id: 'applicant.name',
        title: applicantInformation.labels.name,
        backgroundColor: 'white',
        disabled: !readOnly,
        readOnly: readOnly,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.fullName ??
          application.externalData?.identity?.data?.name ??
          '',
      }),
      buildTextField({
        id: 'applicant.nationalId',
        title: applicantInformation.labels.nationalId,
        format: '######-####',
        width: 'half',
        backgroundColor: 'white',
        disabled: !readOnly,
        readOnly: readOnly,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.nationalId ??
          application.externalData?.identity?.data?.nationalId ??
          '',
      }),
      buildTextField({
        id: 'applicant.address',
        title: applicantInformation.labels.address,
        width: 'half',
        backgroundColor: 'white',
        disabled: !readOnly,
        readOnly: readOnly,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.address
            ?.streetAddress ??
          application.externalData?.identity?.data?.address?.streetAddress ??
          '',
      }),
      buildTextField({
        id: 'applicant.postalCode',
        title: applicantInformation.labels.postalCode,
        width: 'half',
        format: '###',
        backgroundColor: 'white',
        disabled: !readOnly,
        readOnly: readOnly,
        defaultValue: (application: ApplicantInformationInterface) => {
          return (
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode ??
            application.externalData?.identity?.data?.address?.postalCode ??
            ''
          )
        },
      }),
      buildTextField({
        id: 'applicant.city',
        title: applicantInformation.labels.city,
        width: 'half',
        backgroundColor: 'white',
        disabled: !readOnly,
        readOnly: readOnly,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.address?.city ??
          application.externalData?.identity?.data?.address?.city ??
          '',
      }),
      buildTextField({
        id: 'applicant.email',
        title: applicantInformation.labels.email,
        width: 'half',
        variant: 'email',
        backgroundColor: 'blue',
        condition: emailCondition,
        required: emailRequired,
        disabled: emailDisabled,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.userProfile?.data?.email ?? '',
        maxLength: 100,
      }),
      buildPhoneField({
        id: 'applicant.phoneNumber',
        title: applicantInformation.labels.tel,
        width: 'half',
        backgroundColor: 'blue',
        condition: phoneCondition,
        required: phoneRequired,
        disabled: phoneDisabled,
        enableCountrySelector: phoneEnableCountrySelector,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.userProfile?.data?.mobilePhoneNumber ?? '',
      }),
    ],
  })
}
