import {
  buildHiddenInput,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { HealthInsuranceDeclarationApplication } from '../../types'
import {
  getChildrenAsOptions,
  getCommentFromExternalData,
  getInsuranceStatus,
  getSpouseAsOptions,
} from '../../utils'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import * as m from '../../lib/messages'

export const applicantInfoSection = buildSection({
  id: 'applicantInfoSection',
  title: m.application.applicant.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicant',
      title: applicantInformationMessages.general.title,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: applicantInformationMessages.labels.name,
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            application.externalData?.nationalRegistry?.data?.fullName ?? '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: applicantInformationMessages.labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            application.externalData?.nationalRegistry?.data?.nationalId ?? '',
        }),
        buildTextField({
          id: 'applicant.address',
          title: applicantInformationMessages.labels.address,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
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
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            application.externalData?.nationalRegistry?.data?.address
              ?.postalCode ?? '',
        }),
        buildTextField({
          id: 'applicant.city',
          title: applicantInformationMessages.labels.city,
          width: 'half',
          backgroundColor: 'white',
          disabled: true,
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            application.externalData?.nationalRegistry?.data?.address?.city ??
            '',
        }),
        buildTextField({
          id: 'applicant.email',
          title: applicantInformationMessages.labels.email,
          width: 'half',
          variant: 'email',
          backgroundColor: 'blue',
          required: true,
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            application.externalData?.userProfile?.data?.email ?? '',
          maxLength: 100,
        }),
        buildPhoneField({
          id: 'applicant.phoneNumber',
          title: applicantInformationMessages.labels.tel,
          width: 'half',
          backgroundColor: 'blue',
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            application.externalData?.userProfile?.data?.mobilePhoneNumber ??
            '',
          required: true,
        }),
        buildHiddenInput({
          id: 'isHealthInsured',
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            getInsuranceStatus(application.externalData),
        }),
        buildHiddenInput({
          id: 'isHealthInsuredComment',
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            getCommentFromExternalData(application.externalData),
        }),
        buildHiddenInput({
          id: 'hasSpouse',
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            getSpouseAsOptions(application.externalData).length > 0,
        }),
        buildHiddenInput({
          id: 'hasChildren',
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            getChildrenAsOptions(application.externalData).length > 0,
        }),
      ],
    }),
  ],
})
