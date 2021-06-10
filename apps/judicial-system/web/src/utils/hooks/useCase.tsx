import { useMutation } from '@apollo/client'
import {
  Case,
  NotificationType,
  SendNotificationResponse,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  SendNotificationMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import { CreateCaseMutation, CreateCourtCaseMutation } from '../mutations'
import { parseString } from '../formatters'

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
  | 'isolationTo'
  | 'prosecutorOnlySessionRequest'
>

interface CreateCourtCaseMutationResponse {
  createCourtCase: {
    courtCaseNumber: string
  }
}

const useCase = () => {
  const [updateCaseMutation, { loading: isUpdatingCase }] = useMutation(
    UpdateCaseMutation,
  )
  const [createCaseMutation, { loading: isCreatingCase }] = useMutation(
    CreateCaseMutation,
  )
  const [
    createCourtCaseMutation,
    { loading: creatingCourtCase },
  ] = useMutation<CreateCourtCaseMutationResponse>(CreateCourtCaseMutation)
  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation<{ sendNotification: SendNotificationResponse }>(
    SendNotificationMutation,
  )

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

      const resCase: Case = data?.createCase

      return resCase.id
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
    if (creatingCourtCase === false) {
      try {
        const { data, errors } = await createCourtCaseMutation({
          variables: {
            input: {
              caseId: workingCase?.id,
              courtId: workingCase?.court?.id,
              type: workingCase?.type,
              policeCaseNumber: workingCase?.policeCaseNumber,
              isExtension: Boolean(workingCase?.parentCase?.id),
            },
          },
        })

        if (data && workingCase && !errors) {
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
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
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
    updateCase,
    isUpdatingCase,
    createCase,
    isCreatingCase,
    sendNotification,
    isSendingNotification,
    autofill,
    createCourtCase,
    creatingCourtCase,
  }
}

export default useCase
