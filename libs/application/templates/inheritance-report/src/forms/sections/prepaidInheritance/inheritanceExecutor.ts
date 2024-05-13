import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { Application } from '@island.is/api/schema'

export const inheritanceExecutor = buildSection({
  id: 'inheritanceExecutor',
  title: m.irSubmitTitle,
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
          title: m.name,
          defaultValue: ({ externalData }: Application) =>
            formatNationalId(
              (externalData.nationalRegistry?.data as any)?.nationalId,
            ),
          width: 'half',
          readOnly: true,
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
          title: m.name,
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
