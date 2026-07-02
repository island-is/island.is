import {
  buildMultiField,
  buildKeyValueField,
  buildDividerField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, NationalRegistryUser } from '@island.is/api/schema'
import { m } from '../../../lib/messages'
import { BE, B_ADVANCED } from '../../../lib/constants'

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
          value: m.applicationForBELicenseTitle,
          condition: (answers) => answers.applicationFor === BE,
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
      ],
    }),
  ],
})
