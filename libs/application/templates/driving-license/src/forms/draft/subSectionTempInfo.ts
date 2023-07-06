import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import {
  Application,
  NationalRegistryUser,
  Teacher,
  UserProfile,
} from '../../types/schema'
import { m } from '../../lib/messages'
import { B_TEMP } from '../../shared/constants'
import { isApplicationForCondition } from '../../lib/utils'

export const subSectionTempInfo = buildSubSection({
  id: 'infoStep',
  title: m.informationApplicant,
  condition: isApplicationForCondition(B_TEMP),
  children: [
    buildMultiField({
      id: 'info',
      title: m.informationTitle,
      space: 1,
      children: [
        buildKeyValueField({
          label: m.drivingLicenseTypeRequested,
          value: 'Almenn ökuréttindi - B flokkur (Fólksbifreið)',
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

            const { streetAddress, city } = address

            return `${streetAddress}${city ? ', ' + city : ''}`
          },
          width: 'half',
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
        buildTextField({
          id: 'phone',
          title: m.informationYourPhone,
          placeholder: 'Símanúmer',
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile.data as UserProfile
            return data.mobilePhoneNumber
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
        }),
        buildSelectField({
          id: 'drivingInstructor',
          title: m.drivingInstructor,
          disabled: false,
          required: true,
          options: ({
            externalData: {
              teachers: { data },
            },
          }) => {
            return (data as Teacher[]).map(({ name, nationalId }) => ({
              value: nationalId,
              label: name,
            }))
          },
        }),
      ],
    }),
  ],
})
