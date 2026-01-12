import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  NationalRegistryUser,
  TeacherV4,
} from '@island.is/api/schema'
import { m } from '../../lib/messages'
import {
  B_TEMP,
  BE,
  B_FULL_RENEWAL_65,
  B_FULL,
  B_ADVANCED,
} from '../../lib/constants'

export const subSectionApplicantInfo = buildSubSection({
  id: 'infoStep',
  title: m.informationApplicant,
  children: [
    buildMultiField({
      id: 'info',
      title: m.informationApplicant,
      description: m.informationApplicantDescription,
      space: 2,
      children: [
        buildDividerField({}),
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
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForBFullDescription,
          condition: (answers) => answers.applicationFor === B_FULL,
        }),
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: m.applicationForBAdvancedDescription,
          condition: (answers) => answers.applicationFor === B_ADVANCED,
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
          required: true,
          title: m.phoneNumberTitle,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildTextField({
          id: 'email',
          title: m.informationYourEmail,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'userProfile.data.email') ?? '',
        }),
        buildDescriptionField({
          id: 'drivingInstructorTitle',
          title: m.drivingInstructor,
          titleVariant: 'h4',
          marginTop: 'containerGutter',
          description: m.chooseDrivingInstructor,
          condition: (answers) =>
            answers.applicationFor !== B_FULL_RENEWAL_65 &&
            answers.applicationFor !== B_FULL,
        }),
        buildSelectField({
          id: 'drivingInstructor',
          title: m.drivingInstructor,
          condition: (answers) =>
            answers.applicationFor !== B_FULL_RENEWAL_65 &&
            answers.applicationFor !== B_FULL,
          required: true,
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
