import { useMutation } from '@apollo/client'
import {
  Case,
  CaseTransition,
  NotificationType,
  SendNotificationResponse,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  parseString,
  parseTransition,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { CreateCaseMutation } from './createCaseGql'
import { CreateCourtCaseMutation } from './createCourtCaseGql'
import { UpdateCaseMutation } from './updateCaseGql'
import { SendNotificationMutation } from './sendNotificationGql'
import { TransitionCaseMutation } from './transitionCaseGql'

type autofillProperties = Pick<
  Case,
  | 'demands'
  | 'courtAttendees'
  | 'prosecutorDemands'
  | 'litigationPresentations'
  | 'courtStartDate'
  | 'courtCaseFacts'
  | 'courtLegalArguments'
  | 'validToDate'
  | 'isolationToDate'
  | 'prosecutorOnlySessionRequest'
  | 'otherRestrictions'
>

interface CreateCaseMutationResponse {
  createCase: Case
}

interface CreateCourtCaseMutationReqponse {
  createCourtCase: Case
}

interface UpdateCaseMutationResponse {
  updateCase: Case
}

interface TransitionCaseMutationResponse {
  transitionCase: Case
}

interface SendNotificationMutationResponse {
  sendNotification: SendNotificationResponse
}

const useCase = () => {
  const [
    createCaseMutation,
    { loading: isCreatingCase },
  ] = useMutation<CreateCaseMutationResponse>(CreateCaseMutation)
  const [
    createCourtCaseMutation,
    { loading: isCreatingCourtCase },
  ] = useMutation<CreateCourtCaseMutationReqponse>(CreateCourtCaseMutation)
  const [
    updateCaseMutation,
    { loading: isUpdatingCase },
  ] = useMutation<UpdateCaseMutationResponse>(UpdateCaseMutation)
  const [
    transitionCaseMutation,
    { loading: isTransitioningCase },
  ] = useMutation<TransitionCaseMutationResponse>(TransitionCaseMutation)
  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation<SendNotificationMutationResponse>(SendNotificationMutation)

  const createCase = async (theCase: Case): Promise<string | undefined> => {
    if (isCreatingCase === false) {
      const { data } = await createCaseMutation({
        variables: {
          input: {
            type: theCase.type,
            policeCaseNumber: theCase.policeCaseNumber,
            accusedNationalId: theCase.accusedNationalId.replace('-', ''),
            accusedName: theCase.accusedName,
            accusedAddress: theCase.accusedAddress,
            accusedGender: theCase.accusedGender,
            defenderName: theCase.defenderName,
            defenderEmail: theCase.defenderEmail,
            defenderPhoneNumber: theCase.defenderPhoneNumber,
            sendRequestToDefender: theCase.sendRequestToDefender,
            leadInvestigator: theCase.leadInvestigator,
            courtId: theCase.court?.id,
            description: theCase.description,
          },
        },
      })

      if (data) {
        return data.createCase?.id
      }
    }
  }

  const createCourtCase = async (
    workingCase: Case,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>,
    setCourtCaseNumberErrorMessage: React.Dispatch<
      React.SetStateAction<string>
    >,
  ): Promise<void> => {
    if (isCreatingCourtCase === false) {
      try {
        const { data, errors } = await createCourtCaseMutation({
          variables: {
            input: {
              caseId: workingCase.id,
              courtId: workingCase.court?.id,
              type: workingCase.type,
              policeCaseNumber: workingCase.policeCaseNumber,
              isExtension: Boolean(workingCase.parentCase?.id),
            },
          },
        })

        if (data?.createCourtCase?.courtCaseNumber && !errors) {
          setWorkingCase({
            ...workingCase,
            courtCaseNumber: data.createCourtCase.courtCaseNumber,
          })

          setCourtCaseNumberErrorMessage('')

          return
        }
      } catch (error) {
        // Catch all so we can set an eror message
      }

      setCourtCaseNumberErrorMessage(
        'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
      )
    }
  }

  const updateCase = (id: string, updateCase: UpdateCase) => {
    // Only update if id has been set
    if (!id) {
      return
    }

    updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    // TODO: Handle errors and perhaps wait for and do something with the result
  }

  const transitionCase = async (
    workingCase: Case,
    transition: CaseTransition,
    setWorkingCase?: React.Dispatch<React.SetStateAction<Case | undefined>>,
  ): Promise<boolean> => {
    try {
      const transitionRequest = parseTransition(
        workingCase.modified,
        transition,
      )

      const { data } = await transitionCaseMutation({
        variables: { input: { id: workingCase.id, ...transitionRequest } },
      })

      if (!data?.transitionCase?.state) {
        return false
      }

      if (setWorkingCase) {
        setWorkingCase({
          ...workingCase,
          state: data.transitionCase.state,
        })
      }

      return true
    } catch (e) {
      return false
    }
  }

  const sendNotification = async (
    id: string,
    notificationType: NotificationType,
  ): Promise<boolean> => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: notificationType,
        },
      },
    })

    return Boolean(data?.sendNotification?.notificationSent)
  }

  // TODO: find a way for this to work where value is something other then string
  const autofill = (
    key: keyof autofillProperties,
    value: string,
    workingCase: Case,
  ) => {
    if (!workingCase[key]) {
      workingCase[key] = value

      if (workingCase[key]) {
        updateCase(workingCase.id, parseString(key, value))
      }
    }
  }

  return {
    createCase,
    isCreatingCase,
    createCourtCase,
    isCreatingCourtCase,
    updateCase,
    isUpdatingCase,
    transitionCase,
    isTransitioningCase,
    sendNotification,
    isSendingNotification,
    autofill,
  }
}

export default useCase
