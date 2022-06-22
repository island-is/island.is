import { useMemo } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import type {
  NotificationType,
  SendNotificationResponse,
  Case,
  CaseTransition,
  RequestSignatureResponse,
  UpdateCase,
  SessionArrangements,
  CreateCase,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'

import { CreateCaseMutation } from './createCaseGql'
import { CreateCourtCaseMutation } from './createCourtCaseGql'
import { UpdateCaseMutation } from './updateCaseGql'
import { SendNotificationMutation } from './sendNotificationGql'
import { TransitionCaseMutation } from './transitionCaseGql'
import { RequestRulingSignatureMutation } from './requestRulingSignatureGql'
import { RequestCourtRecordSignatureMutation } from './requestCourtRecordSignatureGql'
import { ExtendCaseMutation } from './extendCaseGql'

export type autofillEntry = {
  key: keyof Case
  value?: string | boolean | SessionArrangements | CaseCustodyRestrictions[]
  force?: boolean
}

export type autofillFunc = (
  entries: Array<autofillEntry>,
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
) => void

interface CreateCaseMutationResponse {
  createCase: Case
}

interface CreateCourtCaseMutationResponse {
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

interface RequestRulingSignatureMutationResponse {
  requestRulingSignature: RequestSignatureResponse
}

interface RequestCourtRecordSignatureMutationResponse {
  requestCourtRecordSignature: RequestSignatureResponse
}

interface ExtendCaseMutationResponse {
  extendCase: Case
}

const useCase = () => {
  const { formatMessage } = useIntl()
  const [
    createCaseMutation,
    { loading: isCreatingCase },
  ] = useMutation<CreateCaseMutationResponse>(CreateCaseMutation)
  const [
    createCourtCaseMutation,
    { loading: isCreatingCourtCase },
  ] = useMutation<CreateCourtCaseMutationResponse>(CreateCourtCaseMutation)
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
    { loading: isSendingNotification, error: sendNotificationError },
  ] = useMutation<SendNotificationMutationResponse>(SendNotificationMutation)
  const [
    requestRulingSignatureMutation,
    { loading: isRequestingRulingSignature },
  ] = useMutation<RequestRulingSignatureMutationResponse>(
    RequestRulingSignatureMutation,
  )
  const [
    requestCourtRecordSignatureMutation,
    { loading: isRequestingCourtRecordSignature },
  ] = useMutation<RequestCourtRecordSignatureMutationResponse>(
    RequestCourtRecordSignatureMutation,
  )
  const [
    extendCaseMutation,
    { loading: isExtendingCase },
  ] = useMutation<ExtendCaseMutationResponse>(ExtendCaseMutation)

  const createCase = useMemo(
    () => async (theCase: CreateCase): Promise<Case | undefined> => {
      try {
        if (isCreatingCase === false) {
          const { data } = await createCaseMutation({
            variables: {
              input: {
                type: theCase.type,
                description: theCase.description,
                policeCaseNumber: theCase.policeCaseNumber,
                defenderName: theCase.defenderName,
                defenderNationalId: theCase.defenderNationalId,
                defenderEmail: theCase.defenderEmail,
                defenderPhoneNumber: theCase.defenderPhoneNumber,
                sendRequestToDefender: theCase.sendRequestToDefender,
                leadInvestigator: theCase.leadInvestigator,
              },
            },
          })

          if (data) {
            return data.createCase
          }
        }
      } catch (error) {
        toast.error(formatMessage(errors.createCase))
      }
    },
    [createCaseMutation, formatMessage, isCreatingCase],
  )

  const createCourtCase = useMemo(
    () => async (
      workingCase: Case,
      setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
      setCourtCaseNumberErrorMessage: React.Dispatch<
        React.SetStateAction<string>
      >,
    ): Promise<string> => {
      try {
        if (isCreatingCourtCase === false) {
          const { data, errors } = await createCourtCaseMutation({
            variables: { input: { caseId: workingCase.id } },
          })

          if (data?.createCourtCase?.courtCaseNumber && !errors) {
            setWorkingCase({
              ...workingCase,
              courtCaseNumber: data.createCourtCase.courtCaseNumber,
            })

            setCourtCaseNumberErrorMessage('')

            return data.createCourtCase.courtCaseNumber
          }
        }
      } catch (error) {
        // Catch all so we can set an eror message
        setCourtCaseNumberErrorMessage(
          'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
        )
      }

      return ''
    },
    [createCourtCaseMutation, isCreatingCourtCase],
  )

  const updateCase = useMemo(
    () => async (id: string, updateCase: UpdateCase) => {
      try {
        // Only update if id has been set
        if (!id) {
          return
        }

        const { data } = await updateCaseMutation({
          variables: { input: { id, ...updateCase } },
        })

        return data?.updateCase
      } catch (error) {
        toast.error(formatMessage(errors.updateCase))
      }
    },
    [formatMessage, updateCaseMutation],
  )

  const transitionCase = useMemo(
    () => async (
      workingCase: Case,
      transition: CaseTransition,
      setWorkingCase?: React.Dispatch<React.SetStateAction<Case>>,
    ): Promise<boolean> => {
      try {
        const { data } = await transitionCaseMutation({
          variables: {
            input: {
              id: workingCase.id,
              modified: workingCase.modified,
              transition,
            },
          },
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
        toast.error(formatMessage(errors.transitionCase))
        return false
      }
    },
    [formatMessage, transitionCaseMutation],
  )

  const sendNotification = useMemo(
    () => async (
      id: string,
      notificationType: NotificationType,
      eventOnly?: boolean,
    ): Promise<boolean> => {
      try {
        const { data } = await sendNotificationMutation({
          variables: {
            input: {
              caseId: id,
              type: notificationType,
              eventOnly,
            },
          },
        })

        return Boolean(data?.sendNotification?.notificationSent)
      } catch (e) {
        return false
      }
    },
    [sendNotificationMutation],
  )

  const requestRulingSignature = useMemo(
    () => async (id: string) => {
      try {
        const { data } = await requestRulingSignatureMutation({
          variables: { input: { caseId: id } },
        })

        return data?.requestRulingSignature
      } catch (error) {
        toast.error(formatMessage(errors.requestRulingSignature))
      }
    },
    [formatMessage, requestRulingSignatureMutation],
  )

  const requestCourtRecordSignature = useMemo(
    () => async (id: string) => {
      try {
        const { data } = await requestCourtRecordSignatureMutation({
          variables: { input: { caseId: id } },
        })

        return data?.requestCourtRecordSignature
      } catch (error) {
        toast.error(formatMessage(errors.requestCourtRecordSignature))
      }
    },
    [formatMessage, requestCourtRecordSignatureMutation],
  )

  const extendCase = useMemo(
    () => async (id: string) => {
      try {
        const { data } = await extendCaseMutation({
          variables: { input: { id } },
        })

        return data?.extendCase
      } catch (error) {
        toast.error(formatMessage(errors.extendCase))
      }
    },
    [extendCaseMutation, formatMessage],
  )

  const autofill: autofillFunc = (entries, workingCase, setWorkingCase) => {
    const validEntries = entries.filter(
      (item) =>
        item.value !== undefined &&
        item.value !== null &&
        (item.force ||
          workingCase[item.key] === undefined ||
          workingCase[item.key] === null),
    )

    const flatEntries = Object.assign(
      {},
      ...validEntries.map((entry) => ({ [entry.key]: entry.value })),
    )

    if (Object.keys(flatEntries).length === 0) {
      return
    }

    setWorkingCase({ ...workingCase, ...flatEntries })
    updateCase(workingCase.id, flatEntries)
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
    sendNotificationError,
    requestRulingSignature,
    isRequestingRulingSignature,
    requestCourtRecordSignature,
    isRequestingCourtRecordSignature,
    extendCase,
    isExtendingCase,
    autofill,
  }
}

export default useCase
