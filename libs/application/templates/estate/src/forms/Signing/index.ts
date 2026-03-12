import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildCustomField,
  buildDividerField,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const signingForm: Form = buildForm({
  id: 'signingForm',
  title: m.signingTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'signatoryStatus',
      title: m.signingTitle,
      children: [
        buildMultiField({
          id: 'signatoryStatusMultiField',
          title: m.signingTitle,
          description: m.signingDescription,
          children: [
            buildCustomField({
              id: 'signatoryStatusField',
              title: m.signingTableTitle,
              component: 'SignatoryStatus',
              doesNotRequireAnswer: true,
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'signatoryStatus.info',
              title: m.signingActionsInfoTitle,
              description: m.signingActionsInfoDescription,
              titleVariant: 'h3',
              space: 6,
              marginTop: 7,
            }),
            buildSubmitField({
              id: 'signingActions.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.signingComplete.defaultMessage,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
