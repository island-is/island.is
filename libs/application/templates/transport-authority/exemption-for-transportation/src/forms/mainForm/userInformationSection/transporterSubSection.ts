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
          condition: (answers) => !isSameAsApplicant(answers, 'transporter'),
        }),
        buildPhoneField({
          id: 'transporter.phone',
          title: userInformation.transporter.phone,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: (answers) => !isSameAsApplicant(answers, 'transporter'),
        }),
        buildTextField({
          id: 'transporter.email',
          title: userInformation.transporter.email,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          condition: (answers) => !isSameAsApplicant(answers, 'transporter'),
        }),
        // Transporter - read-only
        buildTextField({
          id: 'transporterReadonly.nationalId',
          title: userInformation.transporter.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answers) => isSameAsApplicant(answers, 'transporter'),
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'transporterReadonly.name',
          title: userInformation.transporter.name,
          width: 'half',
          readOnly: true,
          condition: (answers) => isSameAsApplicant(answers, 'transporter'),
          defaultValue: (application: Application) =>
            application.externalData.nationalRegistry.data?.fullName,
        }),
        buildPhoneField({
          id: 'transporterReadonly.phoneNumber',
          title: userInformation.transporter.phone,
          width: 'half',
          readOnly: true,
          condition: (answers) => isSameAsApplicant(answers, 'transporter'),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.answers,
              'applicant.phoneNumber',
            ),
        }),
        buildTextField({
          id: 'transporterReadonly.email',
          title: userInformation.transporter.email,
          width: 'half',
          readOnly: true,
          condition: (answers) => isSameAsApplicant(answers, 'transporter'),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(application.answers, 'applicant.email'),
        }),

        // Responsible person
        buildDescriptionField({
          id: 'responsiblePersonInfo.subtitle',
          title: userInformation.responsiblePerson.subtitle,
          titleVariant: 'h5',
          marginTop: 4,
          condition: shouldShowResponsiblePerson,
        }),
        buildHiddenInput({
          id: 'responsiblePerson.shouldShow',
          defaultValue: (application: Application) =>
            shouldShowResponsiblePerson(application.answers),
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
          condition: (answers) => shouldShowResponsiblePerson(answers),
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
          condition: (answers) =>
            shouldShowResponsiblePerson(answers) &&
            !isSameAsApplicant(answers, 'responsiblePerson'),
        }),
        // Responsible person - read-only
        buildTextField({
          id: 'responsiblePersonReadOnly.nationalId',
          title: userInformation.responsiblePerson.nationalId,
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (answers) =>
            shouldShowResponsiblePerson(answers) &&
            isSameAsApplicant(answers, 'responsiblePerson'),
          defaultValue: (application: Application) => application.applicant,
        }),
        buildTextField({
          id: 'responsiblePersonReadOnly.name',
          title: userInformation.responsiblePerson.name,
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            shouldShowResponsiblePerson(answers) &&
            isSameAsApplicant(answers, 'responsiblePerson'),
          defaultValue: (application: Application) =>
            application.externalData.nationalRegistry.data?.fullName,
        }),
        buildPhoneField({
          id: 'responsiblePersonReadOnly.phoneNumber',
          title: userInformation.responsiblePerson.phone,
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            shouldShowResponsiblePerson(answers) &&
            isSameAsApplicant(answers, 'responsiblePerson'),
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.answers,
              'applicant.phoneNumber',
            ),
        }),
        buildTextField({
          id: 'responsiblePersonReadOnly.email',
          title: userInformation.responsiblePerson.email,
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            shouldShowResponsiblePerson(answers) &&
            isSameAsApplicant(answers, 'responsiblePerson'),

          defaultValue: (application: Application) =>
            getValueViaPath<string>(application.answers, 'applicant.email'),
        }),
      ],
    }),
  ],
})
