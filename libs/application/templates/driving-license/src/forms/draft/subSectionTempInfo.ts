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
import { B_FULL_RENEWAL_65, B_TEMP } from '../../lib/constants'

export const subSectionTempInfo = buildSubSection({
  id: 'infoStep',
  title: m.informationApplicant,
  condition: (answers) =>
    answers.applicationFor === B_TEMP ||
    answers.applicationFor === B_FULL_RENEWAL_65,
  children: [
    buildMultiField({
      id: 'info',
      title: m.informationTitle,
      space: 1,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: m.overviewName,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) =>
            externalData.nationalRegistry?.data.fullName,
        }),
        buildTextField({
          id: 'applicant.address',
          title: m.informationStreetAddress,
          readOnly: true,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const address =
              (externalData.nationalRegistry.data as NationalRegistryUser)
                .address ?? ''

            if (!address) {
              return ''
            }

            const { streetAddress, city } = address

            return `${streetAddress}${city ? ', ' + city : ''}`
          },
        }),
        buildTextField({
          id: 'email',
          title: m.informationYourEmail,
          placeholder: 'Netfang',
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile.data as UserProfile
            return data.email
          },
        }),
        buildPhoneField({
          id: 'phone',
          title: m.informationYourPhone,
          width: 'half',
          disableDropdown: true,
          allowedCountryCodes: ['IS'],
          defaultValue: ({ externalData }: Application) => {
            const phone =
              (
                externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                }
              )?.mobilePhoneNumber ?? ''

            return phone
          },
        }),
        buildDividerField({
          title: '',
          color: 'dark400',
          condition: (answers) => answers.applicationFor !== B_FULL_RENEWAL_65,
        }),
        buildDescriptionField({
          id: 'drivingInstructorTitle',
          title: m.drivingInstructor,
          titleVariant: 'h3',
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
              label: name,
            }))
          },
        }),
      ],
    }),
  ],
})
