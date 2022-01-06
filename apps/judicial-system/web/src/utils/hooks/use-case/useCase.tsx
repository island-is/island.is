import { useMemo } from 'react'
import { useMutation } from '@apollo/client'

import {
  parseString,
  parseTransition,
} from '@island.is/judicial-system-web/src/utils/formatters'
import type {
  NotificationType,
  SendNotificationResponse,
  Case,
  CaseTransition,
  RequestSignatureResponse,
  UpdateCase,
} from '@island.is/judicial-system/types'

import { CreateCaseMutation } from './createCaseGql'
import { CreateCourtCaseMutation } from './createCourtCaseGql'
import { UpdateCaseMutation } from './updateCaseGql'
import { SendNotificationMutation } from './sendNotificationGql'
import { TransitionCaseMutation } from './transitionCaseGql'
import { RequestRulingSignatureMutation } from './requestRulingSignatureGql'
import { RequestCourtRecordSignatureMutation } from './requestCourtRecordSignatureGql'
import { ExtendCaseMutation } from './extendCaseGql'

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
  | 'conclusion'
  | 'courtDate'
  | 'courtLocation'
  | 'accusedBookings'
  | 'ruling'
  | 'sessionArrangements'
  | 'endOfSessionBookings'
>

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
    { loading: isSendingNotification },
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
    () => async (theCase: Case): Promise<string | undefined> => {
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
    },
    [createCaseMutation, isCreatingCase],
  )

  const createCourtCase = useMemo(
    () => async (
      workingCase: Case,
      setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
      setCourtCaseNumberErrorMessage: React.Dispatch<
        React.SetStateAction<string>
      >,
    ): Promise<string> => {
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

            return data.createCourtCase.courtCaseNumber
          }
        } catch (error) {
          // Catch all so we can set an eror message
          setCourtCaseNumberErrorMessage(
            'Ekki tókst að stofna nýtt mál, reyndu aftur eða sláðu inn málsnúmer',
          )
        }
      }

      return ''
    },
    [createCourtCaseMutation, isCreatingCourtCase],
  )

  const updateCase = useMemo(
    () => async (id: string, updateCase: UpdateCase) => {
      // Only update if id has been set
      if (!id) {
        return
      }

      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })

      // TODO: Handle errors and

      return data?.updateCase
    },
    [updateCaseMutation],
  )

  const transitionCase = useMemo(
    () => async (
      workingCase: Case,
      transition: CaseTransition,
      setWorkingCase?: React.Dispatch<React.SetStateAction<Case>>,
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
    },
    [transitionCaseMutation],
  )

  const sendNotification = useMemo(
    () => async (
      id: string,
      notificationType: NotificationType,
    ): Promise<boolean> => {
      try {
        const { data } = await sendNotificationMutation({
          variables: {
            input: {
              caseId: id,
              type: notificationType,
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
      const { data } = await requestRulingSignatureMutation({
        variables: { input: { caseId: id } },
      })

      return data?.requestRulingSignature
    },
    [requestRulingSignatureMutation],
  )

  const requestCourtRecordSignature = useMemo(
    () => async (id: string) => {
      const { data } = await requestCourtRecordSignatureMutation({
        variables: { input: { caseId: id } },
      })

      return data?.requestCourtRecordSignature
    },
    [requestCourtRecordSignatureMutation],
  )

  const extendCase = useMemo(
    () => async (id: string) => {
      const { data } = await extendCaseMutation({
        variables: { input: { id } },
      })

      return data?.extendCase
    },
    [extendCaseMutation],
  )

  // TODO: find a way for this to work where value is something other then string
  const autofill = useMemo(
    () => (key: keyof autofillProperties, value: string, workingCase: Case) => {
      if (workingCase[key] === null) {
        workingCase[key] = value

        if (workingCase[key]) {
          updateCase(workingCase.id, parseString(key, value))
        }
      }
    },
    [updateCase],
  )

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
