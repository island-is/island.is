import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { state } from '../../../lib/messages'

export const StateSection = buildSection({
  id: 'reviewState',
  title: state.general.sectionTitle,
  children: [
    buildMultiField({
      id: `reviewStateMultiField`,
      title: state.general.pageTitle,
      description: ({ answers }) => ({
        ...state.general.description,
        values: {
          guardianName: getValueViaPath(
            answers,
            `${Routes.FIRSTGUARDIANINFORMATION}.name`,
            '',
          ) as string,
          childName: getValueViaPath(
            answers,
            `${Routes.APPLICANTSINFORMATION}.name`,
            '',
          ) as string,
        },
      }),
      children: [
        buildActionCardListField({
          id: 'approvalActionCard',
          doesNotRequireAnswer: true,
          marginTop: 2,
          items: (application) => {
            const chosenApplicantName = getValueViaPath(
              application.answers,
              `${Routes.APPLICANTSINFORMATION}.name`,
              '',
            ) as string
            return [
              {
                heading: state.labels.actionCardTitle,
                tag: {
                  label: state.labels.actionCardTag,
                  outlined: false,
                  variant: 'purple',
                },
                text: {
                  id: state.labels.actionCardDescription.id,
                  values: { name: chosenApplicantName },
                },
              },
            ]
          },
        }),
      ],
    }),
  ],
})
