import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { maritalStatuses } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Application } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { getApplicationExternalData } from '../../../lib/medicalAndRehabilitationPaymentsUtils'

export const applicantInfoSubSection = buildSubSection({
  id: 'applicantInfoSubSection',
  title: socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantInfo',
      title: socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
      description:
        socialInsuranceAdministrationMessage.info.infoSubSectionDescription,
      children: [
        buildTextField({
          id: 'applicantInfo.name',
          title: socialInsuranceAdministrationMessage.confirm.name,
          disabled: true,
          defaultValue: (application: Application) => {
            const { applicantName } = getApplicationExternalData(
              application.externalData,
            )
            return applicantName
          },
        }),
        buildTextField({
          id: 'applicantInfo.ID',
          title: socialInsuranceAdministrationMessage.confirm.nationalId,
          format: '######-####',
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            kennitala.format(application.applicant),
        }),
        buildTextField({
          id: 'applicantInfo.address',
          title: socialInsuranceAdministrationMessage.info.applicantAddress,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) => {
            const { applicantAddress } = getApplicationExternalData(
              application.externalData,
            )
            return applicantAddress
          },
        }),
        buildTextField({
          id: 'applicantInfo.postcode',
          title: socialInsuranceAdministrationMessage.info.applicantPostalcode,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) => {
            const { applicantPostalCode } = getApplicationExternalData(
              application.externalData,
            )
            return applicantPostalCode
          },
        }),
        buildTextField({
          id: 'applicantInfo.municipality',
          title:
            socialInsuranceAdministrationMessage.info.applicantMunicipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) => {
            const { applicantLocality } = getApplicationExternalData(
              application.externalData,
            )
            return applicantLocality
          },
        }),
        buildTextField({
          id: 'applicantInfo.email',
          title: socialInsuranceAdministrationMessage.info.applicantEmail,
          width: 'half',
          variant: 'email',
          disabled: true,
          defaultValue: (application: Application) => {
            const { userProfileEmail } = getApplicationExternalData(
              application.externalData,
            )
            return userProfileEmail
          },
        }),
        buildPhoneField({
          id: 'applicantInfo.phonenumber',
          title: socialInsuranceAdministrationMessage.info.applicantPhonenumber,
          width: 'half',
          defaultValue: (application: Application) => {
            const { userProfilePhoneNumber } = getApplicationExternalData(
              application.externalData,
            )
            return userProfilePhoneNumber
          },
        }),
        buildDescriptionField({
          id: 'applicantInfo.descriptionField',
          titleVariant: 'h5',
          title:
            socialInsuranceAdministrationMessage.info.applicantMaritalTitle,
          space: 'containerGutter',
          condition: (_, externalData) => {
            const { hasSpouse } = getApplicationExternalData(externalData)
            return !!hasSpouse
          },
        }),
        buildTextField({
          id: 'applicantInfo.maritalStatus',
          title:
            socialInsuranceAdministrationMessage.info.applicantMaritalStatus,
          disabled: true,
          defaultValue: (application: Application) => {
            const { maritalStatus } = getApplicationExternalData(
              application.externalData,
            )
            return maritalStatuses[maritalStatus]
          },
          condition: (_, externalData) => {
            const { maritalStatus } = getApplicationExternalData(externalData)
            return !!maritalStatus
          },
        }),
        buildTextField({
          id: 'applicantInfo.spouseName',
          title: socialInsuranceAdministrationMessage.info.applicantSpouseName,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) => {
            const { spouseName } = getApplicationExternalData(
              application.externalData,
            )
            return spouseName
          },
          condition: (_, externalData) => {
            const { spouseName } = getApplicationExternalData(externalData)
            return !!spouseName
          },
        }),
        buildTextField({
          id: 'applicantInfo.spouseID',
          title: socialInsuranceAdministrationMessage.confirm.nationalId,
          format: '######-####',
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) => {
            const { spouseNationalId } = getApplicationExternalData(
              application.externalData,
            )
            return kennitala.format(spouseNationalId)
          },
          condition: (_, externalData) => {
            const { spouseNationalId } =
              getApplicationExternalData(externalData)
            return !!spouseNationalId
          },
        }),
      ],
    }),
  ],
})
