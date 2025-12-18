import {
  buildAlertMessageField,
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import { participants as participantMessages } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import { isApplyingForMultiple } from '../../../utils'
import { submitTableForm } from '../../../utils/submitTableForm'
import { Participant } from '../../../shared/types'

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
          addItemButtonText:
            participantMessages.labels.addParticipantButtonText,
          loadErrorMessage:
            participantMessages.labels.tableRepeaterLoadErrorMessage,
          onSubmitLoad: async ({ apolloClient, application, tableItems }) => {
            const dictionaryOfItems = await submitTableForm(
              application,
              tableItems,
              apolloClient,
            )
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
        buildHiddenInput({
          id: 'participantFinishedValidation',
          defaultValue: (application: Application) => {
            const hasAnswer = getValueViaPath<Array<Participant>>(
              application.answers,
              'participantList',
            )
            return hasAnswer && hasAnswer.length > 0 ? 'true' : 'false'
          },
        }),
      ],
    }),
  ],
})
