import { useMutation } from '@apollo/client'
import {
  Case,
  CaseTransition,
  NotificationType,
  SendNotificationResponse,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  parseString,
  parseTransition,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { CreateCaseMutation } from './createCaseGql'
import { UpdateCaseMutation } from './updateCaseGql'
import { CreateCourtCaseMutation } from './createCourtCaseGql'

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
        return data.createCase.id
      }
    }

    return undefined
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

        if (data && !errors) {
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

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    // Only update if id has been set
    if (!id) {
      return null
    }
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want the modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const transitionCase = async (
    workingCase: Case,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>,
    transition: CaseTransition,
  ) => {
    try {
      const transitionRequest = parseTransition(
        workingCase.modified,
        transition,
      )

      const { data } = await transitionCaseMutation({
        variables: { input: { id: workingCase.id, ...transitionRequest } },
      })

      if (!data) {
        return false
      }

      setWorkingCase({
        ...workingCase,
        state: data.transitionCase.state,
      })

      return true
    } catch (e) {
      return false
    }
  }

  const sendNotification = async (
    id: string,
    notificationType: NotificationType,
  ) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: notificationType,
        },
      },
    })

    return data?.sendNotification?.notificationSent
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
