import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  buildTitleField,
} from '@island.is/application/core'
import {
  Application,
  NationalRegistryUser,
  TeacherV4,
  UserProfile,
} from '../../types/schema'
import { m } from '../../lib/messages'
import { B_TEMP, BE, B_FULL_RENEWAL_65 } from '../../lib/constants'

export const subSectionTempInfo = buildSubSection({
  id: 'infoStep',
  title: m.informationApplicant,
  condition: (answers) =>
    answers.applicationFor === B_TEMP ||
    answers.applicationFor === BE ||
    answers.applicationFor === B_FULL_RENEWAL_65,
  children: [
    buildMultiField({
      id: 'info',
      title: m.informationApplicant,
      space: 2,
      children: [
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForTempLicenseTitle,
          condition: (answers) => answers.applicationFor === B_TEMP,
        }),
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForBELicenseTitle,
          condition: (answers) => answers.applicationFor === BE,
        }),
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForRenewalLicenseDescription,
          condition: (answers) => answers.applicationFor === B_FULL_RENEWAL_65,
        }),
        buildDividerField({
          marginTop: 5,
          useDividerLine: false,
        }),
        buildKeyValueField({
          label: m.informationFullName,
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.informationStreetAddress,
          value: ({ externalData: { nationalRegistry } }) => {
            const address = (nationalRegistry.data as NationalRegistryUser)
              .address

            if (!address) {
              return ''
            }

            const { streetAddress, postalCode, city } = address

            return `${streetAddress}${
              city ? ', ' + postalCode + ' ' + city : ''
            }`
          },
          width: 'half',
        }),
        buildPhoneField({
          id: 'phone',
          width: 'half',
          title: m.phoneNumberTitle,
          defaultValue: (application: Application) =>
            application.externalData.userProfile.data.mobilePhoneNumber ?? '',
        }),
        buildTextField({
          id: 'email',
          title: m.informationYourEmail,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile.data as UserProfile
            return data.email
          },
        }),
        buildDescriptionField({
          id: 'drivingInstructorTitle',
          title: m.drivingInstructor,
          titleVariant: 'h4',
          description: m.chooseDrivingInstructor,
          condition: (answers) => answers.applicationFor !== B_FULL_RENEWAL_65,
        }),
        buildSelectField({
          id: 'drivingInstructor',
          title: m.drivingInstructor,
          required: true,
          condition: (answers) => answers.applicationFor !== B_FULL_RENEWAL_65,
          options: ({
            externalData: {
              teachers: { data },
            },
          }) => {
            return (data as TeacherV4[]).map(({ name, nationalId }) => ({
              value: nationalId,
              label: `${name} (${nationalId.substring(0, 6)})`,
            }))
          },
        }),
      ],
    }),
  ],
})
