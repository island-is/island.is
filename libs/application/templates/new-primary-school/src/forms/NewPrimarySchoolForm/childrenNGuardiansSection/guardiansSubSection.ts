import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { hasOtherGuardian } from '../../../utils/conditionUtils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getGuardianByNationalId,
  getOtherGuardian,
} from '../../../utils/newPrimarySchoolUtils'

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
            getApplicationExternalData(application.externalData).applicantName,
        }),
        buildTextField({
          id: 'guardians[0].nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          dataTestId: 'nationalId1',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantNationalId,
        }),
        buildTextField({
          id: 'guardians[0].address.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          dataTestId: 'address1',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'guardians[0].address.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          dataTestId: 'postalCode1',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'guardians[0].address.city',
          title: newPrimarySchoolMessages.shared.municipality,
          width: 'half',
          dataTestId: 'city1',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantCity,
        }),
        buildTextField({
          id: 'guardians[0].email',
          title: newPrimarySchoolMessages.shared.email,
          width: 'half',
          dataTestId: 'email1',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .userProfileEmail,
        }),
        buildPhoneField({
          id: 'guardians[0].phoneNumber',
          title: newPrimarySchoolMessages.shared.phoneNumber,
          width: 'half',
          dataTestId: 'phone1',
          placeholder: '000-0000',
          required: true,
          defaultValue: (application: Application) => {
            const { userProfilePhoneNumber } = getApplicationExternalData(
              application.externalData,
            )

            return formatPhoneNumber(
              removeCountryCode(userProfilePhoneNumber ?? ''),
            )
          },
        }),
        buildCheckboxField({
          id: 'guardians[0].requiresInterpreter',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.childrenNGuardians.requiresInterpreter,
            },
          ],
        }),
        buildSelectField({
          id: 'guardians[0].preferredLanguage',
          title: newPrimarySchoolMessages.shared.language,
          placeholder: newPrimarySchoolMessages.shared.languagePlaceholder,
          options: () =>
            getAllLanguageCodes().map((language) => ({
              label: language.name,
              value: language.code,
            })),
          condition: (answers) => {
            const { guardians } = getApplicationAnswers(answers)

            return !!guardians?.[0]?.requiresInterpreter?.includes(YES)
          },
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
            getOtherGuardian(application.answers, application.externalData)
              ?.fullName,
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
            getOtherGuardian(application.answers, application.externalData)
              ?.nationalId,
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
            getOtherGuardian(application.answers, application.externalData)
              ?.address.streetName,
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
            getOtherGuardian(application.answers, application.externalData)
              ?.address.postalCode,
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
            getOtherGuardian(application.answers, application.externalData)
              ?.address.city,
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
          defaultValue: (application: Application) => {
            const otherGuardian = getOtherGuardian(
              application.answers,
              application.externalData,
            )

            const guardian = getGuardianByNationalId(
              application.externalData,
              otherGuardian?.nationalId || '',
            )

            return guardian?.email || ''
          },
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
          defaultValue: (application: Application) => {
            const otherGuardian = getOtherGuardian(
              application.answers,
              application.externalData,
            )

            const guardian = getGuardianByNationalId(
              application.externalData,
              otherGuardian?.nationalId || '',
            )

            return guardian?.phone || ''
          },
        }),
        buildCheckboxField({
          id: 'guardians[1].requiresInterpreter',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.childrenNGuardians.requiresInterpreter,
            },
          ],
          condition: (answers, externalData) =>
            hasOtherGuardian(answers, externalData),
        }),
        buildSelectField({
          id: 'guardians[1].preferredLanguage',
          title: newPrimarySchoolMessages.shared.language,
          placeholder: newPrimarySchoolMessages.shared.languagePlaceholder,
          options: () =>
            getAllLanguageCodes().map((language) => ({
              label: language.name,
              value: language.code,
            })),
          condition: (answers, externalData) => {
            const { guardians } = getApplicationAnswers(answers)

            return (
              hasOtherGuardian(answers, externalData) &&
              !!guardians?.[1]?.requiresInterpreter?.includes(YES)
            )
          },
        }),
      ],
    }),
  ],
})
