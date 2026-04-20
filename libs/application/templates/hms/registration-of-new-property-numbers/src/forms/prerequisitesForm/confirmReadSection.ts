import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
  YES,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const confirmReadSection = buildSection({
  id: 'confirmReadSection',
  tabTitle: m.confirmReadMessages.title,
  children: [
    buildMultiField({
      id: 'confirmRead',
      title: m.confirmReadMessages.title,
      description: m.confirmReadMessages.description,
      children: [
        buildCheckboxField({
          id: 'confirmReadPrivacyPolicy',
          required: true,
          options: [
            {
              label: m.confirmReadMessages.confirmReadPrivacyPolicy,
              value: YES,
            },
          ],
        }),
        buildCheckboxField({
          id: 'confirmReadInfoCompliance',
          required: true,
          options: [
            {
              label: m.confirmReadMessages.confirmReadFireCompensationInfo,
              value: YES,
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: coreMessages.buttonNext,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
