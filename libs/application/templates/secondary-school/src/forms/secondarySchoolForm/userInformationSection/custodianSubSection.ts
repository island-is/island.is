import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildHiddenInput,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import {
  checkHasAnyCustodians,
  getCustodian,
  getHasCustodian,
  Routes,
} from '../../../utils'

export const custodianSubSection = buildSubSection({
  id: 'custodianSubSection',
  title: (application) =>
    checkHasAnyCustodians(application.externalData)
      ? userInformation.custodian.subSectionTitle
      : userInformation.otherContact.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.CUSTODIAN,
      title: (application) =>
        checkHasAnyCustodians(application.externalData)
          ? userInformation.custodian.pageTitle
          : userInformation.otherContact.pageTitle,
      description: (application) =>
        checkHasAnyCustodians(application.externalData)
          ? ''
          : userInformation.otherContact.description,
      children: [
        // Custodians
        // Custodian 1
        buildDescriptionField({
          id: 'custodianInfo1.subtitle',
          title: userInformation.custodian.subtitle1,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => getHasCustodian(externalData, 0),
        }),
        buildTextField({
          id: 'custodians[0].person.name',
          title: userInformation.custodian.name,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasCustodian(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 0)
            return `${parent?.name}`
          },
        }),
        buildTextField({
          id: 'custodians[0].person.nationalId',
          title: userInformation.custodian.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (_, externalData) => getHasCustodian(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 0)
            return `${parent?.nationalId}`
          },
        }),
        buildTextField({
          id: 'custodians[0].legalDomicile.address',
          title: userInformation.custodian.address,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasCustodian(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 0)
            return `${parent?.legalDomicile?.streetAddress}`
          },
        }),
        buildTextField({
          id: 'custodians[0].legalDomicile.postalCodeAndCity',
          title: userInformation.custodian.postalCodeAndCity,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasCustodian(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 0)
            return `${parent?.legalDomicile?.postalCode} ${parent?.legalDomicile?.locality}`
          },
        }),
        buildPhoneField({
          id: 'custodians[0].person.phone',
          title: userInformation.custodian.phone,
          width: 'half',
          required: true,
          condition: (_, externalData) => getHasCustodian(externalData, 0),
        }),
        buildTextField({
          id: 'custodians[0].person.email',
          title: userInformation.custodian.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          condition: (_, externalData) => getHasCustodian(externalData, 0),
        }),

        // Custodian 2
        buildDescriptionField({
          id: 'custodianInfo2.subtitle',
          title: userInformation.custodian.subtitle2,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => getHasCustodian(externalData, 1),
        }),
        buildTextField({
          id: 'custodians[1].person.name',
          title: userInformation.custodian.name,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasCustodian(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 1)
            return `${parent?.name}`
          },
        }),
        buildTextField({
          id: 'custodians[1].person.nationalId',
          title: userInformation.custodian.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (_, externalData) => getHasCustodian(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 1)
            return `${parent?.nationalId}`
          },
        }),
        buildTextField({
          id: 'custodians[1].legalDomicile.address',
          title: userInformation.custodian.address,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasCustodian(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 1)
            return `${parent?.legalDomicile?.streetAddress}`
          },
        }),
        buildTextField({
          id: 'custodians[1].legalDomicile.postalCodeAndCity',
          title: userInformation.custodian.postalCodeAndCity,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasCustodian(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getCustodian(application.externalData, 1)
            return `${parent?.legalDomicile?.postalCode} ${parent?.legalDomicile?.locality}`
          },
        }),
        buildPhoneField({
          id: 'custodians[1].person.phone',
          title: userInformation.custodian.phone,
          width: 'half',
          required: true,
          condition: (_, externalData) => getHasCustodian(externalData, 1),
        }),
        buildTextField({
          id: 'custodians[1].person.email',
          title: userInformation.custodian.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          condition: (_, externalData) => getHasCustodian(externalData, 1),
        }),

        // Main other contact
        buildHiddenInput({
          id: 'mainOtherContact.applicantNationalId',
          defaultValue: (application: Application) => {
            return application.applicant
          },
        }),
        buildHiddenInput({
          id: 'mainOtherContact.include',
          defaultValue: (application: Application) => {
            return !checkHasAnyCustodians(application.externalData)
          },
        }),
        buildDescriptionField({
          id: 'mainOtherContact.subtitle',
          title: () => {
            return {
              ...userInformation.otherContact.subtitle,
              values: {
                index: 1,
              },
            }
          },
          titleVariant: 'h5',
          space: 3,
          condition: (answers) => {
            return (
              getValueViaPath<boolean>(answers, 'mainOtherContact.include') ||
              false
            )
          },
        }),
        buildNationalIdWithNameField({
          id: 'mainOtherContact.person',
          required: false,
          showPhoneField: true,
          showEmailField: true,
          phoneRequired: false,
          emailRequired: false,
          phoneLabel: userInformation.otherContact.phone,
          emailLabel: userInformation.otherContact.email,
          clearOnChange: ['mainOtherContact.person.name'],
          condition: (answers) => {
            return (
              getValueViaPath<boolean>(answers, 'mainOtherContact.include') ||
              false
            )
          },
        }),

        // Other contacts
        buildFieldsRepeaterField({
          id: 'otherContacts',
          formTitle: (index) => {
            return {
              ...userInformation.otherContact.subtitle,
              values: {
                index: index + 2,
              },
            }
          },
          titleVariant: 'h5',
          formTitleNumbering: 'none',
          addItemButtonText: userInformation.otherContact.addButtonLabel,
          removeItemButtonText: userInformation.otherContact.removeButtonLabel,
          minRows: 0,
          maxRows: 1,
          fields: {
            person: {
              component: 'nationalIdWithName',
              required: true,
              showPhoneField: true,
              phoneLabel: userInformation.otherContact.phone,
              phoneRequired: true,
              showEmailField: true,
              emailLabel: userInformation.otherContact.email,
              emailRequired: true,
              clearOnChange: (index) => [`otherContacts[${index}].person.name`],
            },
            applicantNationalId: {
              component: 'hiddenInput',
              defaultValue: (application: Application) => {
                return application.applicant
              },
            },
          },
        }),
      ],
    }),
  ],
})
