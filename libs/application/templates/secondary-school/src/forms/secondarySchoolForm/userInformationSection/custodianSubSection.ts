import {
  buildFieldsRepeaterField,
  buildHiddenInput,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { checkHasAnyCustodians, Routes } from '../../../utils'

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
        buildFieldsRepeaterField({
          id: 'custodians',
          titleVariant: 'h5',
          condition: (_, externalData) => checkHasAnyCustodians(externalData),
          formTitleNumbering: 'suffix',
          formTitle: userInformation.custodian.label,
          addItemButtonText: userInformation.custodian.addButtonLabel,
          removeItemButtonText: userInformation.custodian.removeButtonLabel,
          minRows: 1,
          maxRows: 2,
          marginTop: 0,
          fields: {
            person: {
              component: 'nationalIdWithName',
              required: true,
            },
            'legalDomicile.streetAddress': {
              component: 'input',
              label: userInformation.custodian.address,
              required: true,
              width: 'half',
            },
            'legalDomicile.postalCode': {
              component: 'input',
              label: userInformation.custodian.postalCode,
              required: true,
              width: 'half',
            },
            'person.phone': {
              component: 'phone',
              label: userInformation.custodian.phone,
              enableCountrySelector: true,
              required: true,
              width: 'half',
            },
            'person.email': {
              component: 'input',
              label: userInformation.custodian.email,
              type: 'email',
              required: true,
              width: 'half',
            },
          },
        }),

        // Main other contact
        buildHiddenInput({
          id: 'mainOtherContact.applicantNationalId',
          defaultValue: (application: Application) => {
            return application.applicant
          },
        }),
        buildHiddenInput({
          id: 'mainOtherContact.required',
          defaultValue: (application: Application) => {
            return !checkHasAnyCustodians(application.externalData)
          },
        }),
        buildNationalIdWithNameField({
          id: 'mainOtherContact.person',
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

        // Other contacts
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
              showPhoneField: true,
              phoneLabel: userInformation.otherContact.phone,
              phoneRequired: true,
              showEmailField: true,
              emailLabel: userInformation.otherContact.email,
              emailRequired: true,
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
