import {
  buildMultiField,
  buildPhoneField,
  buildTextField,
} from '@island.is/application/core'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { GrindavikHousingBuyoutApplication } from '../types'
import * as m from '../lib/messages'

export const applicantInformationMultiField = buildMultiField({
  id: 'applicant',
  title: applicantInformationMessages.general.title,
  children: [
    buildTextField({
      id: 'applicant.name',
      title: applicantInformationMessages.labels.name,
      backgroundColor: 'white',
      disabled: true,
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.nationalRegistry?.data?.fullName ?? '',
    }),
    buildTextField({
      id: 'applicant.nationalId',
      title: applicantInformationMessages.labels.nationalId,
      format: '######-####',
      width: 'half',
      backgroundColor: 'white',
      disabled: true,
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.nationalRegistry?.data?.nationalId ?? '',
    }),
    buildTextField({
      id: 'applicant.address',
      title: applicantInformationMessages.labels.address,
      width: 'half',
      backgroundColor: 'white',
      disabled: true,
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.nationalRegistry?.data?.address
          ?.streetAddress ?? '',
    }),
    buildTextField({
      id: 'applicant.postalCode',
      title: applicantInformationMessages.labels.postalCode,
      width: 'half',
      format: '###',
      backgroundColor: 'white',
      disabled: true,
      defaultValue: (application: GrindavikHousingBuyoutApplication) => {
        return (
          application.externalData?.nationalRegistry?.data?.address
            ?.postalCode ?? ''
        )
      },
    }),
    buildTextField({
      id: 'applicant.city',
      title: applicantInformationMessages.labels.city,
      width: 'half',
      backgroundColor: 'white',
      disabled: true,
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.nationalRegistry?.data?.address?.city ?? '',
    }),
    buildTextField({
      id: 'applicant.email',
      title: applicantInformationMessages.labels.email,
      width: 'half',
      variant: 'email',
      backgroundColor: 'blue',
      required: true,
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.userProfile?.data?.email ?? '',
      maxLength: 100,
    }),
    buildPhoneField({
      id: 'applicant.phoneNumber',
      title: applicantInformationMessages.labels.tel,
      width: 'half',
      backgroundColor: 'blue',
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.userProfile?.data?.mobilePhoneNumber ?? '',
      required: true,
    }),
    buildTextField({
      id: 'applicantBankInfo',
      title: m.application.applicant.bankInfo,
      width: 'full',
      backgroundColor: 'blue',
      placeholder: '0000-00-000000',
      required: true,
      format: '####-##-######',
      defaultValue: (application: GrindavikHousingBuyoutApplication) =>
        application.externalData?.userProfile?.data?.bankInfo
          ?.split('-')
          .join('') ?? '',
    }),
  ],
})
