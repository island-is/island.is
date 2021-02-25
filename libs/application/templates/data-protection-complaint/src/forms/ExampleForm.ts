import {
  buildForm,
  buildDescriptionField,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const ExampleForm: Form = buildForm({
  id: 'DataProtectionComplaintForm',
  title: 'Atvinnuleysisbætur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildDescriptionField({
          id: 'field',
          title: m.introField,
          description: (application) => ({
            ...m.introIntroduction,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            values: { name: application.answers.name },
          }),
        }),
      ],
    }),
  ],
})
