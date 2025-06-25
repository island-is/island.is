import {
  buildAlertMessageField,
  buildHiddenInput,
  buildMultiField,
  buildPhoneField,
  buildTextField,
} from '@island.is/application/core'

import { applicantInformation } from './messages'
import {
  ApplicantInformationInterface,
  applicantInformationProps,
} from './types'

// This is extracted out if someone wants to build a applicantInformation screen that has more elements than the default
export const applicantInformationArray = (
  props?: applicantInformationProps,
) => {
  const {
    phoneCondition,
    phoneRequired = false,
    phoneDisabled = false,
    phoneEnableCountrySelector,
    emailCondition,
    emailRequired = true,
    emailDisabled = false,
    baseInfoReadOnly = false,
    emailAndPhoneReadOnly = false,
    compactFields = false,
  } = props ?? {}

  // Note: base info fields are not editable, and are default displayed as disabled fields.
  // If baseInfoReadOnly=true, then these fields will be displayed as readonly instead of disabled
  const baseInfoDisabled = !baseInfoReadOnly

  return [
    buildTextField({
      id: 'applicant.name',
      title: applicantInformation.labels.name,
      width: compactFields ? 'half' : 'full',
      backgroundColor: 'white',
      disabled: baseInfoDisabled,
      readOnly: baseInfoReadOnly,
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
      disabled: baseInfoDisabled,
      readOnly: baseInfoReadOnly,
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
      disabled: baseInfoDisabled,
      readOnly: baseInfoReadOnly,
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
      disabled: baseInfoDisabled,
      readOnly: baseInfoReadOnly,
      defaultValue: (application: ApplicantInformationInterface) => {
        return (
          application.externalData?.nationalRegistry?.data?.address
            ?.postalCode ??
          application.externalData?.identity?.data?.address?.postalCode ??
          ''
        )
      },
      condition: () => !compactFields,
    }),
    buildHiddenInput({
      id: 'applicant.postalCode',
      defaultValue: (application: ApplicantInformationInterface) => {
        return (
          application.externalData?.nationalRegistry?.data?.address
            ?.postalCode ??
          application.externalData?.identity?.data?.address?.postalCode ??
          ''
        )
      },
      condition: () => !!compactFields,
    }),
    buildTextField({
      id: 'applicant.city',
      title: applicantInformation.labels.city,
      width: 'half',
      backgroundColor: 'white',
      disabled: baseInfoDisabled,
      readOnly: baseInfoReadOnly,
      defaultValue: (application: ApplicantInformationInterface) =>
        application.externalData?.nationalRegistry?.data?.address?.city ??
        application.externalData?.identity?.data?.address?.city ??
        '',
      condition: () => !compactFields,
    }),
    buildHiddenInput({
      id: 'applicant.city',
      defaultValue: (application: ApplicantInformationInterface) =>
        application.externalData?.nationalRegistry?.data?.address?.city ??
        application.externalData?.identity?.data?.address?.city ??
        '',
      condition: () => !!compactFields,
    }),
    buildTextField({
      id: 'applicant.postalCodeAndCity',
      title:
        props?.customPostalCodeAndCityLabel ??
        applicantInformation.labels.postalCodeAndCity,
      width: 'half',
      backgroundColor: 'white',
      disabled: baseInfoDisabled,
      readOnly: baseInfoReadOnly,
      defaultValue: (application: ApplicantInformationInterface) => {
        const postalCode =
          application.externalData?.nationalRegistry?.data?.address
            ?.postalCode ??
          application.externalData?.identity?.data?.address?.postalCode ??
          ''
        const city =
          application.externalData?.nationalRegistry?.data?.address?.city ??
          application.externalData?.identity?.data?.address?.city ??
          ''
        return `${postalCode} ${city}`
      },
      condition: () => !!compactFields,
    }),
    buildTextField({
      id: 'applicant.email',
      title: applicantInformation.labels.email,
      width: 'half',
      variant: 'email',
      backgroundColor: 'blue',
      condition: emailCondition,
      required: emailRequired,
      disabled: emailDisabled && !emailAndPhoneReadOnly,
      readOnly: emailAndPhoneReadOnly,
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
      disabled: phoneDisabled && !emailAndPhoneReadOnly,
      readOnly: emailAndPhoneReadOnly,
      enableCountrySelector: phoneEnableCountrySelector,
      defaultValue: (application: ApplicantInformationInterface) =>
        application.externalData?.userProfile?.data?.mobilePhoneNumber ?? '',
    }),
    buildAlertMessageField({
      id: 'applicationInfoEmailPhoneAlertMessage',
      title: '',
      alertType: 'info',
      doesNotRequireAnswer: true,
      message: applicantInformation.labels.alertMessage,
      links: [
        {
          title: applicantInformation.labels.alertMessageLinkTitle,
          url: applicantInformation.labels.alertMessageLink,
          isExternal: false,
        },
      ],
      condition: () => emailAndPhoneReadOnly,
    }),
  ]
}

export const applicantInformationMultiField = (
  props?: applicantInformationProps,
) => {
  // Phone required is default false for all applications
  // Email required is default true for all applications
  // Email disabled is default false for all applications
  // Option to add description
  const { applicantInformationTitle, applicantInformationDescription = '' } =
    props ?? {}
  return buildMultiField({
    id: 'applicant',
    title: applicantInformationTitle ?? applicantInformation.general.title,
    description: applicantInformationDescription,
    children: [...applicantInformationArray(props)],
  })
}
