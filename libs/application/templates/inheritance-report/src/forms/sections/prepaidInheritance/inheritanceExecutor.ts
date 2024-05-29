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
          id: 'executors.executor',
          title: 'Arfláti 1',
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'executors.executor.name',
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            (externalData.nationalRegistry?.data as NationalRegistryUser)
              ?.fullName ?? '',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executors.executor.nationalId',
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
          id: 'executors.executor.phone',
          title: m.phone,
          width: 'half',
          format: '###-####',
          required: true,
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
          id: 'executors.executor.email',
          title: m.email,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) => {
            const data = externalData.userProfile?.data as UserProfile
            return data?.email
          },
        }),
        //Todo: ef hjúskaparstaða er married
        buildCheckboxField({
          id: 'executors.skipSpouse',
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
          id: 'executors.spouse',
          title: 'Arfláti 2',
          titleVariant: 'h3',
          space: 'containerGutter',
          condition: (answers) =>
            !((answers.executors as any)?.skipSpouse as Array<string>)?.length,
        }),
        buildTextField({
          id: 'executors.spouse.name',
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            getSpouseFromExternalData(externalData)?.fullName,
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            !((answers.executors as any)?.skipSpouse as Array<string>)?.length,
        }),
        buildTextField({
          id: 'executors.spouse.nationalId',
          title: m.nationalId,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              getSpouseFromExternalData(externalData)?.nationalId ?? '',
            ),
          width: 'half',
          readOnly: true,
          condition: (answers) =>
            !((answers.executors as any)?.skipSpouse as Array<string>)?.length,
        }),
        buildTextField({
          id: 'executors.spouse.email',
          title: m.email,
          width: 'half',
          variant: 'email',
          required: true,
          condition: (answers) =>
            !((answers.executors as any)?.skipSpouse as Array<string>)?.length,
        }),
        buildPhoneField({
          id: 'executors.spouse.phone',
          title: m.phone,
          width: 'half',
          required: true,
          condition: (answers) =>
            !((answers.executors as any)?.skipSpouse as Array<string>)?.length,
        }),
      ],
    }),
  ],
})
