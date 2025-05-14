import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { isSameAsApplicant, shouldShowResponsiblePerson } from '../../../utils'
import { Application } from '@island.is/api/schema'

export const userInformationSection = buildSection({
  id: 'userInformationSection',
  title: userInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'userInformationMultiField',
      title: userInformation.general.pageTitle,
      children: [
        // Applicant
        buildDescriptionField({
          id: 'applicantInfo.subtitle',
          title: userInformation.applicant.subtitle,
          titleVariant: 'h5',
        }),
        ...applicantInformationMultiField({
          baseInfoReadOnly: true,
          // hideLocationFields: true, //TODOx compact location fields?
          emailRequired: true,
          phoneRequired: true,
          phoneEnableCountrySelector: true,
        }).children,

        // Transporter
        buildDescriptionField({
          id: 'transporterInfo.subtitle',
          title: userInformation.transporter.subtitle,
          titleVariant: 'h5',
          marginTop: 4,
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
          phoneRequired: true,
          emailRequired: true,
          showPhoneField: true,
          showEmailField: true,
          searchPersons: true,
          searchCompanies: true,
          customNationalIdLabel: userInformation.transporter.nationalId,
          customNameLabel: userInformation.transporter.name,
          phoneLabel: userInformation.transporter.phone,
          emailLabel: userInformation.transporter.email,
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
        // Transporter - read-only
        // TODO hide these fields to not have duplicate IDS, or use setOnChange with applicant email and phone
        buildTextField({
          id: 'applicant.nationalId',
          title: userInformation.transporter.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildTextField({
          id: 'applicant.name',
          title: userInformation.transporter.name,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildPhoneField({
          id: 'applicant.phoneNumber',
          title: userInformation.transporter.phone,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildTextField({
          id: 'applicant.email',
          title: userInformation.transporter.email,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildTextField({
          id: 'applicant.address',
          title: userInformation.transporter.address,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            return application.externalData.nationalRegistry.data?.address
              ?.streetAddress
          },
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
          },
        }),
        buildTextField({
          id: 'applicant.postalCode',
          title: userInformation.transporter.postalCodeAndCity,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            return `${application.externalData.nationalRegistry?.data?.address?.postalCode} ${application.externalData.nationalRegistry?.data?.address?.locality}`
          },
          condition: (answers) => {
            return isSameAsApplicant(answers, 'transporter')
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
        buildHiddenInput({
          id: 'responsiblePerson.isSameAsApplicant',
          condition: (answers) => {
            return !shouldShowResponsiblePerson(answers)
          },
          defaultValue: [YES],
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
        // TODO hide these fields to not have duplicate IDS, or use setOnChange with applicant email and phone
        buildTextField({
          id: 'applicant.nationalId',
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
        }),
        buildTextField({
          id: 'applicant.name',
          title: userInformation.responsiblePerson.name,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
        }),
        buildPhoneField({
          id: 'applicant.phoneNumber',
          title: userInformation.responsiblePerson.phone,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
        }),
        buildTextField({
          id: 'applicant.email',
          title: userInformation.responsiblePerson.email,
          width: 'half',
          readOnly: true,
          condition: (answers) => {
            return (
              shouldShowResponsiblePerson(answers) &&
              isSameAsApplicant(answers, 'responsiblePerson')
            )
          },
        }),
      ],
    }),
  ],
})
