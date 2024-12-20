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
import { getParent, getHasParent, Routes } from '../../../utils'

export const custodianSubSection = buildSubSection({
  id: 'custodianSubSection',
  title: (application) =>
    getHasParent(application.externalData, 0)
      ? userInformation.custodian.subSectionTitle
      : userInformation.otherContact.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.CUSTODIAN,
      title: (application) =>
        getHasParent(application.externalData, 0)
          ? userInformation.custodian.pageTitle
          : userInformation.otherContact.pageTitle,
      description: (application) =>
        getHasParent(application.externalData, 0)
          ? ''
          : userInformation.otherContact.description,
      children: [
        // Custodian 1
        buildDescriptionField({
          id: 'custodianInfo1.subtitle',
          title: userInformation.custodian.subtitle1,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => getHasParent(externalData, 0),
        }),
        buildTextField({
          id: 'custodians[0].name',
          title: userInformation.custodian.name,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasParent(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 0)
            return `${parent?.givenName} ${parent?.familyName}`
          },
        }),
        buildTextField({
          id: 'custodians[0].nationalId',
          title: userInformation.custodian.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (_, externalData) => getHasParent(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 0)
            return `${parent?.nationalId}`
          },
        }),
        buildTextField({
          id: 'custodians[0].address',
          title: userInformation.custodian.address,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasParent(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 0)
            return `${parent?.legalDomicile?.streetAddress}`
          },
        }),
        buildTextField({
          id: 'custodians[0].postalCodeAndCity',
          title: userInformation.custodian.postalCodeAndCity,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasParent(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 0)
            return `${parent?.legalDomicile?.postalCode} ${parent?.legalDomicile?.locality}`
          },
        }),
        buildPhoneField({
          id: 'custodians[0].phone',
          title: userInformation.custodian.phone,
          width: 'half',
          required: true,
          condition: (_, externalData) => getHasParent(externalData, 0),
        }),
        buildTextField({
          id: 'custodians[0].email',
          title: userInformation.custodian.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          condition: (_, externalData) => getHasParent(externalData, 0),
        }),

        // Custodian 2
        buildDescriptionField({
          id: 'custodianInfo2.subtitle',
          title: userInformation.custodian.subtitle2,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => getHasParent(externalData, 1),
        }),
        buildTextField({
          id: 'custodians[1].name',
          title: userInformation.custodian.name,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasParent(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 1)
            return `${parent?.givenName} ${parent?.familyName}`
          },
        }),
        buildTextField({
          id: 'custodians[1].nationalId',
          title: userInformation.custodian.nationalId,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          format: '######-####',
          condition: (_, externalData) => getHasParent(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 1)
            return `${parent?.nationalId}`
          },
        }),
        buildTextField({
          id: 'custodians[1].address',
          title: userInformation.custodian.address,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasParent(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 1)
            return `${parent?.legalDomicile?.streetAddress}`
          },
        }),
        buildTextField({
          id: 'custodians[1].postalCodeAndCity',
          title: userInformation.custodian.postalCodeAndCity,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => getHasParent(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 1)
            return `${parent?.legalDomicile?.postalCode} ${parent?.legalDomicile?.locality}`
          },
        }),
        buildPhoneField({
          id: 'custodians[1].phone',
          title: userInformation.custodian.phone,
          width: 'half',
          required: true,
          condition: (_, externalData) => getHasParent(externalData, 1),
        }),
        buildTextField({
          id: 'custodians[1].email',
          title: userInformation.custodian.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          condition: (_, externalData) => getHasParent(externalData, 1),
        }),

        // Other contact
        buildHiddenInput({
          id: 'mainOtherContact.required',
          defaultValue: (application: Application) => {
            return getHasParent(application.externalData, 0) ? false : true
          },
        }),
        buildNationalIdWithNameField({
          id: 'mainOtherContact',
          title: '',
          required: true,
          showPhoneField: true,
          showEmailField: true,
          phoneRequired: true,
          emailRequired: true,
          phoneLabel: userInformation.otherContact.phone,
          emailLabel: userInformation.otherContact.email,
          condition: (answers) => {
            return (
              getValueViaPath<boolean>(answers, 'mainOtherContact.required') ||
              false
            )
          },
        }),
        buildFieldsRepeaterField({
          id: 'otherContacts',
          title: userInformation.otherContact.subtitle,
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
            },
            phone: {
              component: 'phone',
              label: userInformation.otherContact.phone,
              enableCountrySelector: true,
              required: true,
              width: 'half',
            },
            email: {
              component: 'input',
              label: userInformation.otherContact.email,
              type: 'email',
              required: true,
              width: 'half',
            },
          },
        }),
      ],
    }),
  ],
})
