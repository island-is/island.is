import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../../lib/constants'
import { state } from '../../../lib/messages'
import { GetFormattedText } from '../../../utils'

export const StateSection = buildSection({
  id: 'reviewState',
  title: state.general.sectionTitle,
  children: [
    buildMultiField({
      id: `reviewMultiField`,
      title: state.general.pageTitle,
      description: state.general.description,
      children: [
        buildActionCardListField({
          id: 'approvalActionCard',
          doesNotRequireAnswer: true,
          title: '',
          items: (application) => {
            console.log(application)
            // TODO: Setja inn rétt id í dataschema
            const parentBName = getValueViaPath(
              application.answers,
              `${Routes.CHOSENAPPLICANTS}.name`,
              'forsjáraðila 2',
            )
            const chosenApplicantName = getValueViaPath(
              application.answers,
              `${Routes.CHOSENAPPLICANTS}.name`,
              'Barn 1',
            )
            const heading = GetFormattedText(
              application,
              state.labels.actionCardTitle,
            )
            const description = GetFormattedText(
              application,
              state.labels.actionCardDescription,
            )
            const label = GetFormattedText(
              application,
              state.labels.actionCardTag,
            )
            return [
              {
                heading: `${heading} ${parentBName}`,
                tag: {
                  label: label || 'Samþykki í vinnslu',
                  outlined: false,
                  variant: 'purple',
                },
                text: `${description} ${chosenApplicantName}`,
              },
            ]
          },
        }),
        buildSubmitField({
          id: 'goToNextPage',
          title: '',
          refetchApplicationAfterSubmit: false,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: state.buttons.openApproval,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
