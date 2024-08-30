import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  buildAlertMessageField,
} from '@island.is/application/core'
import { IdentityDocumentChild, Routes } from '../../../lib/constants'
import { state } from '../../../lib/messages'
import { getChosenApplicant } from '../../../utils'

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
        buildAlertMessageField({
          id: 'stateAlertMessage',
          title: '',
          message: state.labels.alertMessage,
          alertType: 'info',
          condition: (formValue, externalData) => {
            const chosenApplicantNationalId = getValueViaPath(
              formValue,
              'chosenApplicants',
              '',
            ) as string

            const applicantNationalId = getValueViaPath(
              externalData,
              'nationalRegistry.data.nationalId',
              '',
            ) as string

            const applicantChildren = getValueViaPath(
              externalData,
              'identityDocument.data.childPassports',
              [],
            ) as Array<IdentityDocumentChild>

            const chosenChild = applicantChildren.filter(
              (x) => x.childNationalId === chosenApplicantNationalId,
            )?.[0]

            return chosenChild.secondParent !== applicantNationalId
          },
        }),
        buildActionCardListField({
          id: 'approvalActionCard',
          doesNotRequireAnswer: true,
          marginTop: 2,
          title: '',
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
