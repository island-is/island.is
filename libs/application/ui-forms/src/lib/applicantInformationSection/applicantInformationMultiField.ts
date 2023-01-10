import { buildMultiField, buildTextField } from '@island.is/application/core'
import { FormText } from '@island.is/application/types'

import { applicantInformation } from './messages'
import { ApplicantInformationInterface } from './types'

export const applicantInformationMultiField = (data?: {
  title?: FormText
  description?: FormText
}) => {
  const { title, description } = data ?? {}

  return buildMultiField({
    id: 'applicant',
    title: title ?? applicantInformation.general.title,
    description: description ?? undefined,
    children: [
      buildTextField({
        id: 'applicant.name',
        title: applicantInformation.labels.name,
        backgroundColor: 'white',
        disabled: true,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.nationalRegistry?.data?.fullName ??
          application.externalData.identity?.data?.name ??
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
          application.externalData.identity?.data?.nationalId ??
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
          application.externalData.identity?.data?.address?.streetAddress ??
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
            application.externalData.identity?.data?.address?.postalCode ??
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
          application.externalData.identity?.data?.address?.city ??
          '',
      }),
      buildTextField({
        id: 'applicant.email',
        title: applicantInformation.labels.email,
        variant: 'email',
        width: 'full',
        required: true,
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.userProfile?.data?.email ?? '',
        maxLength: 100,
      }),
      buildTextField({
        id: 'applicant.countryCode',
        title: applicantInformation.labels.countryCode,
        width: 'half',
        variant: 'tel',
        defaultValue: (application: ApplicantInformationInterface) =>
          application.externalData?.userProfile?.data?.mobilePhoneNumber?.split(
            '-',
          )[0] ?? '',
        maxLength: 100,
      }),
      buildTextField({
        id: 'applicant.phoneNumber',
        title: applicantInformation.labels.tel,
        format: '+###-###-####',
        width: 'half',
        variant: 'tel',

        defaultValue: (application: ApplicantInformationInterface) => {
          const number =
            application.externalData?.userProfile?.data?.mobilePhoneNumber ?? ''
          return number
          return number.replace(/(^00354|^\+354|\D)/g, '')
        },
      }),
    ],
  })
}
