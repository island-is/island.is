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
        // SignatoryStatus owns the live lookup and disables this action until
        // the latest successful response has no pending signers. Keeping the
        // action visible lets a successful in-screen refresh recover
        // applications that entered signing after a transient lookup failure.
        buildSubmitField({
          id: 'reviewActions.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
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
