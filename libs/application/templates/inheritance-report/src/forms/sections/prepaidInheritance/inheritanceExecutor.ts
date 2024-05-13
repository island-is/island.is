import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { Application, UserProfile } from '@island.is/api/schema'
import { removeCountryCode } from '@island.is/application/ui-components'
import { applicant } from '../applicant'

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
            (externalData.nationalRegistry?.data as any)?.fullName ?? '',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorNationalId',
          title: m.nationalId,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              (externalData.nationalRegistry?.data as any)?.nationalId,
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
        buildDescriptionField({
          id: 'executor2',
          title: 'Arfláti 2',
          titleVariant: 'h3',
          space: 'containerGutter',
        }),
        buildTextField({
          id: 'executorSpouseName',
          title: m.name,
          defaultValue: 'Bobbi Bobbason',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorSpouseNationalId',
          title: m.nationalId,
          defaultValue: '010130-3019',
          width: 'half',
          readOnly: true,
        }),
        buildTextField({
          id: 'executorSpouseEmail',
          title: m.email,
          width: 'half',
          variant: 'email',
        }),
        buildPhoneField({
          id: 'executorSpousePhone',
          title: m.phone,
          width: 'half',
        }),
      ],
    }),
  ],
})
