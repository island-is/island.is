import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
} from '@island.is/application/core'
import {
  Application,
  NationalRegistryUser,
  TeacherV4,
  UserProfile,
} from '../../types/schema'
import { m } from '../../lib/messages'
import { B_TEMP, BE } from '../../lib/constants'

export const subSectionTempInfo = buildSubSection({
  id: 'infoStep',
  title: m.informationApplicant,
  condition: (answers) =>
    answers.applicationFor === B_TEMP || answers.applicationFor === BE,
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
        buildDividerField({
          title: '',
          color: 'dark400',
        }),
        buildKeyValueField({
          label: m.informationApplicant,
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
        buildDividerField({
          title: '',
        }),
        buildDescriptionField({
          id: 'drivingInstructorTitle',
          title: m.drivingInstructor,
          titleVariant: 'h4',
          description: m.chooseDrivingInstructor,
        }),
        buildSelectField({
          id: 'drivingInstructor',
          title: m.drivingInstructor,
          required: true,
          options: ({
            externalData: {
              teachers: { data },
            },
          }) => {
            return (data as TeacherV4[]).map(({ name, nationalId }) => ({
              value: nationalId,
              label: name,
            }))
          },
        }),
      ],
    }),
  ],
})
