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
  getOtherGuardian,
  hasOtherGuardian,
} from '../../../lib/newPrimarySchoolUtils'

export const guardiansSubSection = buildSubSection({
  id: 'guardiansSubSection',
  title: newPrimarySchoolMessages.childrenNGuardians.guardiansSubSectionTitle,
  children: [
    buildMultiField({
      id: 'guardians',
      title:
        newPrimarySchoolMessages.childrenNGuardians.guardiansSubSectionTitle,
      description:
        newPrimarySchoolMessages.childrenNGuardians.guardiansDescription,
      children: [
        buildDescriptionField({
          id: 'guardiansInfo1',
          title: newPrimarySchoolMessages.childrenNGuardians.guardian,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'guardians[0].fullName',
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
          id: 'guardians[0].nationalId',
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
          id: 'guardians[0].address.streetAddress',
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
          id: 'guardians[0].address.postalCode',
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
          id: 'guardians[0].address.city',
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
          id: 'guardians[0].email',
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
          id: 'guardians[0].phoneNumber',
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
          id: 'guardiansInfo2',
          title: newPrimarySchoolMessages.childrenNGuardians.otherGuardian,
          titleVariant: 'h4',
          marginTop: 'containerGutter',
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
        }),
        buildTextField({
          id: 'guardians[1].fullName',
          title: newPrimarySchoolMessages.shared.fullName,
          dataTestId: 'fullName2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherGuardian(application)?.fullName,
        }),
        buildTextField({
          id: 'guardians[1].nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          dataTestId: 'nationalId2',
          format: '######-####',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherGuardian(application)?.nationalId,
        }),
        buildTextField({
          id: 'guardians[1].address.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          dataTestId: 'address2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherGuardian(application)?.address.streetName,
        }),
        buildTextField({
          id: 'guardians[1].address.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          dataTestId: 'postalCode2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherGuardian(application)?.address.postalCode,
        }),
        buildTextField({
          id: 'guardians[1].address.city',
          title: newPrimarySchoolMessages.shared.municipality,
          width: 'half',
          dataTestId: 'city2',
          disabled: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
          defaultValue: (application: Application) =>
            getOtherGuardian(application)?.address.city,
        }),
        buildTextField({
          id: 'guardians[1].email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          dataTestId: 'email2',
          variant: 'email',
          required: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
        }),
        buildPhoneField({
          id: 'guardians[1].phoneNumber',
          title: newPrimarySchoolMessages.shared.phoneNumber,
          width: 'half',
          dataTestId: 'phone2',
          placeholder: '000-0000',
          required: true,
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
        }),
      ],
    }),
  ],
})
