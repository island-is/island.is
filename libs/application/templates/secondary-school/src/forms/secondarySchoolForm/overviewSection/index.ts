import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { error, overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { getEndOfDayUTCDate, getFirstRegistrationEndDate } from '../../../utils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: overview.general.pageTitle,
      description: overview.general.description,
      children: [
        buildAlertMessageField({
          id: 'alertPastRegistrationEndDate',
          alertType: 'error',
          title: error.errorPastRegistrationDateTitle,
          message: error.errorPastRegistrationDateDescription,
          condition: (answers) => {
            return (
              getEndOfDayUTCDate(getFirstRegistrationEndDate(answers)) <
              new Date()
            )
          },
        }),
        buildCustomField({
          component: 'Overview',
          id: 'overview',
          description: '',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.buttons.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
