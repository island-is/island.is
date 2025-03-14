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
  SeminarIndividual,
  SeminarsIndividualValidationItem,
} from '@island.is/api/schema'
import { ARE_INDIVIDUALS_VALID } from '../../../graphql/queries'
import { Participant } from '../../../shared/types'
import { isApplyingForMultiple } from '../../../utils'

interface ParticipantWitValidation extends Participant {
  errorMessage: string
  errorMessageEn: string
}

export const participantsSection = buildSection({
  id: 'participants',
  title: participantMessages.general.sectionTitle,
  condition: (answers: FormValue) => {
    const userIsApplyingForMultiple = isApplyingForMultiple(answers)
    return userIsApplyingForMultiple
  },
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
            const nationalIdOfApplicant = getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
              '',
            )

            const individuals: Array<SeminarIndividual> =
              tableItems?.map((x) => {
                return {
                  nationalId: x.nationalIdWithName.nationalId,
                  email: x.email,
                }
              }) ?? []
            const { data } = await apolloClient.query<
              { areIndividualsValid: Array<SeminarsIndividualValidationItem> },
              QueryAreIndividualsValidArgs
            >({
              query: ARE_INDIVIDUALS_VALID,
              variables: {
                courseID: courseID,
                nationalIdOfRegisterer: nationalIdOfApplicant,
                input: { individuals: individuals },
              },
            })

            const updatedParticipants: Array<ParticipantWitValidation> =
              tableItems.map((x) => {
                const participantInRes = data.areIndividualsValid.filter(
                  (z: SeminarsIndividualValidationItem) =>
                    z.nationalID === x.nationalIdWithName.nationalId,
                )
                return {
                  ...x,
                  disabled: !participantInRes[0].mayTakeCourse,
                  errorMessage: participantInRes[0].errorMessage,
                  errorMessageEn: participantInRes[0].errorMessageEn,
                }
              })

            const dictionaryOfItems: Array<{ path: string; value: string }> =
              updatedParticipants.map((x, i) => {
                return {
                  path: `participantList[${i}].disabled`,
                  value: x.disabled ? 'true' : 'false',
                }
              })

            const disabledItem = updatedParticipants.find((x) => !!x.disabled)
            if (disabledItem) {
              dictionaryOfItems.push({
                path: 'participantValidityError',
                value: disabledItem.errorMessage,
              })
            } else {
              dictionaryOfItems.push({
                path: 'participantValidityError',
                value: '',
              })
            }

            return {
              dictionaryOfItems,
            }
          },

          table: {
            header: [
              participantMessages.labels.name,
              participantMessages.labels.nationalId,
              participantMessages.labels.email,
              participantMessages.labels.phoneNumber,
            ],
          },
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: 'National ID with name',
              searchPersons: true,
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
          message: (application, _) => {
            const error = getValueViaPath<string>(
              application.answers,
              'participantValidityError',
              '',
            )
            return error
          },
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, _) => {
            const hasError = getValueViaPath<string>(
              answers,
              'participantValidityError',
              '',
            )
            return !!hasError
          },
        }),
        buildCustomField({
          id: 'participantCSV',
          doesNotRequireAnswer: true,
          component: 'Participants',
        }),
        buildAlertMessageField({
          id: 'participantList.error',
          message: participantMessages.labels.csvError,
          alertType: 'error',
          doesNotRequireAnswer: true,
          condition: (answers: FormValue, _) => {
            const hasError = getValueViaPath<string>(
              answers,
              'participantCsvError',
              'false',
            )

            return hasError === 'true'
          },
        }),
      ],
    }),
  ],
})
