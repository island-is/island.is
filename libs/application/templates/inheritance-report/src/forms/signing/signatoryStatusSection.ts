import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildCustomField,
  buildDividerField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const signatoryStatusSection = buildSection({
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
          id: 'reviewActions.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: m.inReviewActionsBackToEdit.defaultMessage,
              type: 'subtle',
            },
            {
              event: DefaultEvents.SUBMIT,
              name: m.inReviewActionsComplete.defaultMessage,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
