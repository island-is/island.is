import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

import { m } from '../../lib/messages'
import { isApplicationForCondition } from '../../lib/utils'
import { B_TEMP } from '../../shared/constants'
import { NationalRegistryUser, Teacher } from '../../types/schema'

export const subSectionTempInfo = buildSubSection({
  id: 'infoStep',
  title: m.informationTitle,
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
          options: ({
            externalData: {
              teachers: { data },
            },
          }) => {
            return (data as Teacher[]).map(({ name }) => ({
              value: name,
              label: name,
            }))
          },
        }),
      ],
    }),
  ],
})
