import { useMutation } from '@apollo/client'
import {
  Case,
  NotificationType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import {
  SendNotificationMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import { CreateCaseMutation } from '../mutations'

const useCase = () => {
  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const [createCaseMutation, { loading: isCreatingCase }] = useMutation(
    CreateCaseMutation,
  )
  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

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

  return {
    updateCase,
    createCase,
    isCreatingCase,
    sendNotification,
    isSendingNotification,
  }
}

export default useCase
