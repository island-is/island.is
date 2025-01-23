import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'

import { participants as participantMessages } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import {
  QueryAreIndividualsValidArgs,
  SeminarsIndividualValidationItem,
} from '@island.is/api/schema'
import { ARE_INDIVIDUALS_VALID } from '../../../graphql/queries'
import { Participant } from '../../../shared/types'

export const participantsSection = buildSection({
  id: 'participants',
  title: participantMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'participantsMultiField',
      title: participantMessages.general.pageTitle,
      description: participantMessages.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'participantList',
          title: '',
          addItemButtonText:
            participantMessages.labels.addParticipantButtonText,
          loadErrorMessage:
            participantMessages.labels.tableRepeaterLoadErrorMessage,
          onSubmitLoad: async ({ apolloClient, application, tableItems }) => {
            const courseID =
              getValueViaPath<string>(
                application.answers,
                'initialQuery',
                '',
              ) ?? ''
            const nationalIds = tableItems?.map((x) => x.nationalId) ?? []
            console.log(nationalIds)
            const { data } = await apolloClient.query<
              { areIndividualsValid: Array<SeminarsIndividualValidationItem> }, //TODO get this correct from schemas
              QueryAreIndividualsValidArgs
            >({
              query: ARE_INDIVIDUALS_VALID,
              variables: {
                courseID: courseID,
                nationalIds: nationalIds,
              },
            })
            console.log(data)

            const updatedParticipants: Array<Participant> = tableItems.map(
              (x) => {
                const participantInRes = data.areIndividualsValid.filter(
                  (z: any) => z.nationalID === x.nationalId,
                )
                return { ...x, disabled: !participantInRes[0].mayTakeCourse }
              },
            )

            const dictinaryOfItems: Array<{ path: string; value: string }> =
              updatedParticipants.map((x, i) => {
                return {
                  path: `participantList[${i}].disabled`,
                  value: x.disabled ? 'true' : 'false',
                }
              })

            if (updatedParticipants.find((x) => !!x.disabled)) {
              dictinaryOfItems.push({
                path: 'participantValidityError',
                value: 'true',
              })
            }
            console.log(dictinaryOfItems)

            return {
              dictinaryOfItems,
            }
          },
          fields: {
            name: {
              component: 'input',
              label: participantMessages.labels.name,
              width: 'half',
            },
            nationalId: {
              component: 'input',
              label: participantMessages.labels.nationalId,
              width: 'half',
              format: '######-####',
            },
            email: {
              component: 'input',
              label: participantMessages.labels.email,
              width: 'half',
            },
            phoneNumber: {
              component: 'phone',
              label: participantMessages.labels.phoneNumber,
              width: 'half',
            },
          },
        }),
        buildAlertMessageField({
          id: 'participantList.validityError',
          title: '',
          message: participantMessages.labels.validityError,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, _) => {
            const hasError = getValueViaPath<boolean>(
              answers,
              'participantValidityError',
              false,
            )
            return !!hasError
          },
        }),
        buildCustomField({
          id: 'participantCSV',
          title: '',
          doesNotRequireAnswer: true,
          component: 'Participants',
        }),
        buildAlertMessageField({
          id: 'participantList.error',
          title: '',
          message: participantMessages.labels.csvError,
          alertType: 'error',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, _) => {
            const hasError = getValueViaPath<boolean>(
              answers,
              'participantCsvError',
              false,
            )
            return !!hasError
          },
        }),
      ],
    }),
  ],
})
