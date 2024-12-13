import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { error, overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { getEndOfDayUTC, getFirstRegistrationEndDate } from '../../../utils'

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
          id: 'alertPastRegistrationdate',
          alertType: 'error',
          title: error.errorPastRegistrationDateTitle,
          message: error.errorPastRegistrationDateDescription,
          condition: (answers) => {
            return (
              getEndOfDayUTC(getFirstRegistrationEndDate(answers)) < new Date()
            )
          },
        }),
        buildCustomField({
          component: 'Overview',
          id: 'overview',
          title: '',
          description: '',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.confirmation.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.confirmation.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
