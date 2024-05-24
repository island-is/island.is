import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  Application,
  NationalRegistryUser,
  UserProfile,
} from '@island.is/api/schema'
import { removeCountryCode } from '@island.is/application/ui-components'
import {
  getSpouseFromExternalData,
  isApplicantMarried,
} from '../../../lib/utils/helpers'

export const inheritanceExecutor = buildSection({
  id: 'inheritanceExecutor',
  title: 'Arflátar',
  children: [
    buildMultiField({
      id: 'inheritanceExecutor',
      title: 'Arflátar',
      description:
        'Lorem ipsum foo bar beep boop meep morp lorem ipsum foo bar beep boop meep morp lorem ipsum foo bar beep boop meep morp.',
      children: [
        buildDescriptionField({
          id: 'executor1',
          title: 'Arfláti 1',
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'executorName',
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            (externalData.nationalRegistry?.data as NationalRegistryUser)
              ?.fullName ?? '',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorNationalId',
          title: m.nationalId,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              (externalData.nationalRegistry?.data as NationalRegistryUser)
                ?.nationalId,
            ),
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorPhone',
          title: m.phone,
          width: 'half',
          format: '###-####',
          defaultValue: (application: Application) => {
            const phone =
              (
                application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                }
              )?.mobilePhoneNumber ?? ''

            return removeCountryCode(phone)
          },
        }),
        buildTextField({
          id: 'executorEmail',
          title: m.email,
          width: 'half',
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile?.data as UserProfile
            return data?.email
          },
        }),
        //Todo: ef hjúskaparstaða er married
        buildCheckboxField({
          id: 'skipSpouseExecutor',
          title: '',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.skipSpousePrePaid,
            },
          ],
          condition: (_, externalData) => isApplicantMarried(externalData),
        }),
        buildDescriptionField({
          id: 'executorSpouse',
          title: 'Arfláti 2',
          titleVariant: 'h3',
          space: 'containerGutter',
          condition: (answers) =>
            !(answers.skipSpouseExecutor as Array<string>)?.length,
        }),
        buildTextField({
          id: 'executorSpouseName',
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            getSpouseFromExternalData(externalData)?.fullName,
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            !(answers.skipSpouseExecutor as Array<string>)?.length,
        }),
        buildTextField({
          id: 'executorSpouseNationalId',
          title: m.nationalId,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              getSpouseFromExternalData(externalData)?.nationalId ?? '',
            ),
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            !(answers.skipSpouseExecutor as Array<string>)?.length,
        }),
        buildTextField({
          id: 'executorSpouseEmail',
          title: m.email,
          width: 'half',
          variant: 'email',
          condition: (answers) =>
            !(answers.skipSpouseExecutor as Array<string>)?.length,
        }),
        buildPhoneField({
          id: 'executorSpousePhone',
          title: m.phone,
          width: 'half',
          condition: (answers) =>
            !(answers.skipSpouseExecutor as Array<string>)?.length,
        }),
      ],
    }),
  ],
})
