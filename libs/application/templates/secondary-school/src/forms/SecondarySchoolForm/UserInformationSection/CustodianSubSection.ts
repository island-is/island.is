import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { getParent, hasParent } from '../../../utils'

//TODOx þarf að gera tengilið required ef aðili er yfir 18 og það eru engir forsjáraðliar?
export const custodianSubSection = buildSubSection({
  id: 'custodianSubSection',
  title: userInformation.custodian.subSectionTitle,
  children: [
    buildMultiField({
      id: 'custodianMultiField',
      title: userInformation.custodian.pageTitle,
      children: [
        // Custodian 1
        buildDescriptionField({
          id: 'custodianInfo1.subtitle',
          title: userInformation.custodian.subtitle1,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => hasParent(externalData, 0),
        }),
        buildTextField({
          id: 'custodians[0].name',
          title: userInformation.custodian.name,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => hasParent(externalData, 0),
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
          condition: (_, externalData) => hasParent(externalData, 0),
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
          condition: (_, externalData) => hasParent(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 0)
            return `${parent?.legalDomicile?.streetAddress}`
          },
        }),
        buildTextField({
          id: 'custodians[0].postalCode',
          title: userInformation.custodian.postalCode,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => hasParent(externalData, 0),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 0)
            return `${parent?.legalDomicile?.postalCode} ${parent?.legalDomicile?.locality}`
          },
        }),
        buildTextField({
          id: 'custodians[0].email',
          title: userInformation.custodian.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          condition: (_, externalData) => hasParent(externalData, 0),
        }),
        buildPhoneField({
          id: 'custodians[0].phone',
          title: userInformation.custodian.phone,
          width: 'half',
          required: true,
          condition: (_, externalData) => hasParent(externalData, 0),
        }),

        // Custodian 2
        buildDescriptionField({
          id: 'custodianInfo2.subtitle',
          title: userInformation.custodian.subtitle2,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => hasParent(externalData, 1),
        }),
        buildTextField({
          id: 'custodians[1].name',
          title: userInformation.custodian.name,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => hasParent(externalData, 1),
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
          condition: (_, externalData) => hasParent(externalData, 1),
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
          condition: (_, externalData) => hasParent(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 1)
            return `${parent?.legalDomicile?.streetAddress}`
          },
        }),
        buildTextField({
          id: 'custodians[1].postalCode',
          title: userInformation.custodian.postalCode,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          condition: (_, externalData) => hasParent(externalData, 1),
          defaultValue: (application: Application) => {
            const parent = getParent(application.externalData, 1)
            return `${parent?.legalDomicile?.postalCode} ${parent?.legalDomicile?.locality}`
          },
        }),
        buildTextField({
          id: 'custodians[1].email',
          title: userInformation.custodian.email,
          backgroundColor: 'blue',
          width: 'half',
          variant: 'email',
          required: true,
          condition: (_, externalData) => hasParent(externalData, 1),
        }),
        buildPhoneField({
          id: 'custodians[1].phone',
          title: userInformation.custodian.phone,
          width: 'half',
          required: true,
          condition: (_, externalData) => hasParent(externalData, 1),
        }),

        // Other contact
        buildDescriptionField({
          id: 'otherContact.subtitle',
          title: userInformation.otherContact.subtitle,
          titleVariant: 'h5',
          space: 3,
          condition: (_, externalData) => hasParent(externalData, 1),
        }),
        buildCustomField({
          component: 'OtherContact',
          id: 'otherContact',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
