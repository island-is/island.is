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
import {
  CreateCaseMutation,
  CreateCustodyCourtCaseMutation,
  CreateCourtCaseMutation,
} from '../mutations'
import { parseString } from '../formatters'

type autofillProperties = Pick<
  Case,
  'courtAttendees' | 'policeDemands' | 'litigationPresentations'
>

interface CreateCustodyCourtCaseMutationResponse {
  createCustodyCourtCase: {
    courtCaseNumber: string
  }
}

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
    createCustodyCourtCaseMutation,
    { loading: creatingCustodyCourtCase },
  ] = useMutation<CreateCustodyCourtCaseMutationResponse>(
    CreateCustodyCourtCaseMutation,
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
            court: 'Héraðsdómur Reykjavíkur',
          },
        },
      })

      const resCase: Case = data?.createCase

      return resCase.id
    }

    return undefined
  }

  const createCustodyCourtCase = async (
    workingCase: Case,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>,
    setCourtCaseNumberErrorMessage: React.Dispatch<
      React.SetStateAction<string>
    >,
  ): Promise<void> => {
    if (creatingCustodyCourtCase === false) {
      try {
        const { data, errors } = await createCustodyCourtCaseMutation({
          variables: {
            input: {
              caseId: workingCase?.id,
              policeCaseNumber: workingCase?.policeCaseNumber,
            },
          },
        })

        if (data && workingCase && !errors) {
          setWorkingCase({
            ...workingCase,
            courtCaseNumber: data.createCustodyCourtCase.courtCaseNumber,
          })

          setCourtCaseNumberErrorMessage('')

          return
        }
      } catch (error) {
        // Catch all so we can set an eror message
      }
      setCourtCaseNumberErrorMessage(
        'Ekki tókst að stofna mál, vinsamlegast reyndu aftur eða sláðu inn málsnr. í reitinn',
      )
    }
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
        'Ekki tókst að stofna mál, vinsamlegast reyndu aftur eða sláðu inn málsnr. í reitinn',
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
    createCustodyCourtCase,
    creatingCustodyCourtCase,
    createCourtCase,
    creatingCourtCase,
  }
}

export default useCase
