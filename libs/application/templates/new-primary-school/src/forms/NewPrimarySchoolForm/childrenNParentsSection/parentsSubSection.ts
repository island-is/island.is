import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationExternalData,
  getOtherParent,
  hasOtherParent,
} from '../../../lib/newPrimarySchoolUtils'

export const parentsSubSection = buildSubSection({
  id: 'parentsSubSection',
  title: newPrimarySchoolMessages.childrenNParents.parentsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'parents',
      title: newPrimarySchoolMessages.childrenNParents.parentsSubSectionTitle,
      description: newPrimarySchoolMessages.childrenNParents.parentsDescription,
      children: [
        buildDescriptionField({
          id: 'parentsInfo1',
          title: newPrimarySchoolMessages.childrenNParents.parent,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'parents.parent1.fullName',
          title: newPrimarySchoolMessages.shared.fullName,
          dataTestId: 'fullName1',
          disabled: true,
          defaultValue: (application: Application) =>
            (
              application.externalData.nationalRegistry?.data as {
                fullName?: string
              }
            )?.fullName,
        }),
        buildTextField({
          id: 'parents.parent1.nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          dataTestId: 'nationalId1',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            (
              application.externalData.nationalRegistry?.data as {
                nationalId?: string
              }
            )?.nationalId,
        }),
        buildTextField({
          id: 'parents.parent1.address.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          dataTestId: 'address1',
          disabled: true,
          defaultValue: (application: Application) => {
            return getApplicationExternalData(application.externalData)
              .applicantAddress
          },
        }),
        buildTextField({
          id: 'parents.parent1.address.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          dataTestId: 'postalCode1',
          disabled: true,
          defaultValue: (application: Application) => {
            return getApplicationExternalData(application.externalData)
              .applicantPostalCode
          },
        }),
        buildTextField({
          id: 'parents.parent1.address.city',
          title: newPrimarySchoolMessages.shared.municipality,
          width: 'half',
          dataTestId: 'city1',
          disabled: true,
          defaultValue: (application: Application) => {
            return getApplicationExternalData(application.externalData)
              .applicantCity
          },
        }),
        buildTextField({
          id: 'parents.parent1.email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          dataTestId: 'email',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            (
              application.externalData.userProfile?.data as {
                email?: string
              }
            )?.email,
        }),
        buildPhoneField({
          id: 'parents.parent1.phoneNumber',
          title: newPrimarySchoolMessages.shared.phoneNumber,
          width: 'half',
          defaultValue: (application: Application) => {
            const phoneNumber = (
              application.externalData.userProfile?.data as {
                mobilePhoneNumber?: string
              }
            )?.mobilePhoneNumber

            return formatPhoneNumber(removeCountryCode(phoneNumber ?? ''))
          },
          dataTestId: 'phone1',
          placeholder: '000-0000',
          required: true,
        }),

        buildDescriptionField({
          id: 'parentsInfo2',
          title: newPrimarySchoolMessages.childrenNParents.otherParent,
          titleVariant: 'h4',
          marginTop: 'containerGutter',
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
        }),
        buildTextField({
          id: 'parents.parent2.fullName',
          title: newPrimarySchoolMessages.shared.fullName,
          dataTestId: 'fullName2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherParent(application)?.fullName,
        }),
        buildTextField({
          id: 'parents.parent2.nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          dataTestId: 'nationalId2',
          format: '######-####',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherParent(application)?.nationalId,
        }),
        buildTextField({
          id: 'parents.parent2.address.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          dataTestId: 'address2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherParent(application)?.address.streetName,
        }),
        buildTextField({
          id: 'parents.parent2.address.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          dataTestId: 'postalCode2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherParent(application)?.address.postalCode,
        }),
        buildTextField({
          id: 'parents.parent2.address.city',
          title: newPrimarySchoolMessages.shared.municipality,
          width: 'half',
          dataTestId: 'city2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherParent(application)?.address.city,
        }),
        buildTextField({
          id: 'parents.parent2.email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          dataTestId: 'email2',
          variant: 'email',
          required: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
        }),
        buildPhoneField({
          id: 'parents.parent2.phoneNumber',
          title: newPrimarySchoolMessages.shared.phoneNumber,
          width: 'half',
          dataTestId: 'phone2',
          placeholder: '000-0000',
          required: true,
          condition: (answers, externalData) =>
            hasOtherParent(answers, externalData),
        }),
      ],
    }),
  ],
})
