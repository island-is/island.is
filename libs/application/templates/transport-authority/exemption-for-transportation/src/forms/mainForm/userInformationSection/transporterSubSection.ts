import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { isSameAsApplicant, shouldShowResponsiblePerson } from '../../../utils'
import { Application } from '@island.is/api/schema'

export const transporterSubSection = buildSubSection({
  id: 'transporterSubSection',
  title: userInformation.transporter.subSectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: userInformation.transporter.pageTitle,
      children: [
        // Transporter
        buildDescriptionField({
          id: 'transporterInfo.subtitle',
          title: userInformation.transporter.subtitle,
          titleVariant: 'h5',
        }),
        buildCheckboxField({
          id: 'transporter.isSameAsApplicant',
          large: false,
          backgroundColor: 'white',
          options: [
            {
              value: YES,
              label: userInformation.transporter.isSameAsApplicant,
            },
          ],
          defaultValue: [],
          marginBottom: 0,
        }),
        // Transporter - editable
        buildNationalIdWithNameField({
          id: 'transporter',
          required: true,
          showPhoneField: false,
          showEmailField: false,
          searchPersons: true,
          searchCompanies: true,
          customNationalIdLabel: userInformation.transporter.nationalId,
          customNameLabel: userInformation.transporter.name,
          clearOnChange: ['transporter.name'],
          condition: (answers) => {
            return !isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildTextField({
          id: 'transporter.address',
          title: userInformation.transporter.address,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: (answers) => {
            return !isSameAsApplicant(answers, 'transporter')
          },
          maxLength: 100,
        }),
        buildTextField({
          id: 'transporter.postalCodeAndCity',
          title: userInformation.transporter.postalCodeAndCity,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: (answers) => {
            return !isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildPhoneField({
          id: 'transporter.phone',
          title: userInformation.transporter.phone,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: (answers) => {
            return !isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildTextField({
          id: 'transporter.email',
          title: userInformation.transporter.email,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: (answers) => {
            return !isSameAsApplicant(answers, 'transporter')
          },
        }),
        // Transporter - read-only
        buildTextField({
          id: 'transporterReadonly.nationalId',
          title: userInformation.transporter.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
          defaultValue: (application: Application) => {
            return application.applicant
          },
        }),
        buildTextField({
          id: 'transporterReadonly.name',
          title: userInformation.transporter.name,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
          defaultValue: (application: Application) => {
            return application.externalData.nationalRegistry.data?.fullName
          },
        }),
        buildTextField({
          id: 'transporterReadonly.address',
          title: userInformation.transporter.address,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
          defaultValue: (application: Application) => {
            return application.externalData.nationalRegistry.data?.address
              ?.streetAddress
          },
        }),
        buildTextField({
          id: 'transporterReadonly.postalCodeAndCity',
          title: userInformation.transporter.postalCodeAndCity,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
          defaultValue: (application: Application) => {
            return `${application.externalData.nationalRegistry?.data?.address?.postalCode} ${application.externalData.nationalRegistry?.data?.address?.locality}`
          },
        }),
        buildPhoneField({
          id: 'transporterReadonly.phoneNumber',
          title: userInformation.transporter.phone,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
          defaultValue: (application: Application) => {
            return getValueViaPath<string>(
              application.answers,
              'applicant.phoneNumber',
            )
          },
        }),
        buildTextField({
          id: 'transporterReadonly.email',
          title: userInformation.transporter.email,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
          defaultValue: (application: Application) => {
            return getValueViaPath<string>(
              application.answers,
              'applicant.email',
            )
          },
        }),

        // Responsible person
        buildDescriptionField({
          id: 'responsiblePersonInfo.subtitle',
          title: userInformation.responsiblePerson.subtitle,
          titleVariant: 'h5',
          marginTop: 4,
          condition: (answers) => {
            return shouldShowResponsiblePerson(answers)
          },
        }),
        buildHiddenInput({
          id: 'responsiblePerson.shouldShow',
          defaultValue: (application: Application) => {
            return shouldShowResponsiblePerson(application.answers)
          },
        }),
        buildCheckboxField({
          id: 'responsiblePerson.isSameAsApplicant',
          large: false,
          backgroundColor: 'white',
          options: [
            {
              value: YES,
              label: userInformation.responsiblePerson.isSameAsApplicant,
            },
          ],
          defaultValue: [],
          condition: (answers) => {
            return shouldShowResponsiblePerson(answers)
          },
        }),
        // Responsible person - editable
        buildNationalIdWithNameField({
          id: 'responsiblePerson',
          required: true,
          showPhoneField: true,
          showEmailField: true,
          phoneRequired: true,
          emailRequired: true,
          customNationalIdLabel: userInformation.responsiblePerson.nationalId,
          customNameLabel: userInformation.responsiblePerson.name,
          phoneLabel: userInformation.responsiblePerson.phone,
          emailLabel: userInformation.responsiblePerson.email,
          clearOnChange: ['responsiblePerson.name'],
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              !isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
        }),
        // Responsible person - read-only
        buildTextField({
          id: 'responsiblePersonReadOnly.nationalId',
          title: userInformation.responsiblePerson.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
          defaultValue: (application: Application) => {
            return application.applicant
          },
        }),
        buildTextField({
          id: 'responsiblePersonReadOnly.name',
          title: userInformation.responsiblePerson.name,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
          defaultValue: (application: Application) => {
            return application.externalData.nationalRegistry.data?.fullName
          },
        }),
        buildPhoneField({
          id: 'responsiblePersonReadOnly.phoneNumber',
          title: userInformation.responsiblePerson.phone,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
          defaultValue: (application: Application) => {
            return getValueViaPath<string>(
              application.answers,
              'applicant.phoneNumber',
            )
          },
        }),
        buildTextField({
          id: 'responsiblePersonReadOnly.email',
          title: userInformation.responsiblePerson.email,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
          defaultValue: (application: Application) => {
            return getValueViaPath<string>(
              application.answers,
              'applicant.email',
            )
          },
        }),
      ],
    }),
  ],
})
