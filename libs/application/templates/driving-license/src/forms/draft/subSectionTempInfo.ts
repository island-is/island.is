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
import { B_TEMP, BE, B_FULL_RENEWAL_65 } from '../../lib/constants'
import { NationalRegistryIndividual } from '@island.is/application/types'

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
        buildTextField({
          id: 'applicant.name',
          title: m.overviewName,
          readOnly: true,
          defaultValue: ({ externalData }: Application) =>
            (externalData.nationalRegistry?.data as NationalRegistryIndividual)
              .fullName,
        }),
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
            return `${address?.streetAddress}${
              address?.postalCode ? ', ' + address?.postalCode : ''
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
          color: 'dark400',
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
