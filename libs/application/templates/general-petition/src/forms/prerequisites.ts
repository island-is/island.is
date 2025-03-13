import {
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const prerequisites: Form = buildForm({
  id: 'prerequisites',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: m.introTitle,
      children: [
        buildMultiField({
          title: m.introTitle,
          description: m.introDescription,
          children: [
            buildSubmitField({
              id: 'prereqs.submit',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.introSubmit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'stepperExternalData',
      title: m.externalDataSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'stepperInfo',
      title: m.listInformationTitle,
      children: [],
    }),
    buildSection({
      id: 'stepperOverview',
      title: m.overviewTitle,
      children: [],
    }),
  ],
})
