import { useMemo } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import formatISO from 'date-fns/formatISO'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import isNil from 'lodash/isNil'

import type {
  NotificationType,
  SendNotificationResponse,
  CaseTransition,
  RequestSignatureResponse,
} from '@island.is/judicial-system/types'
import {
  TempCase as Case,
  TempUpdateCase as UpdateCase,
  TempCreateCase as CreateCase,
} from '@island.is/judicial-system-web/src/types'
import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'

import { CreateCaseMutation } from './createCaseGql'
import { CreateCourtCaseMutation } from './createCourtCaseGql'
import { UpdateCaseMutation } from './updateCaseGql'
import { SendNotificationMutation } from './sendNotificationGql'
import { TransitionCaseMutation } from './transitionCaseGql'
import { RequestCourtRecordSignatureMutation } from './requestCourtRecordSignatureGql'
import { ExtendCaseMutation } from './extendCaseGql'

type ChildKeys = Pick<
  UpdateCase,
  | 'courtId'
  | 'prosecutorId'
  | 'sharedWithProsecutorsOfficeId'
  | 'registrarId'
  | 'judgeId'
>

export type autofillEntry = Partial<UpdateCase> & {
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

interface RequestCourtRecordSignatureMutationResponse {
  requestCourtRecordSignature: RequestSignatureResponse
}

interface ExtendCaseMutationResponse {
  extendCase: Case
}

function isChildKey(key: keyof UpdateCase): key is keyof ChildKeys {
  return [
    'courtId',
    'prosecutorId',
    'sharedWithProsecutorsOfficeId',
    'registrarId',
    'judgeId',
  ].includes(key)
}

const childof: { [Property in keyof ChildKeys]-?: keyof Case } = {
  courtId: 'court',
  prosecutorId: 'prosecutor',
  sharedWithProsecutorsOfficeId: 'sharedWithProsecutorsOffice',
  registrarId: 'registrar',
  judgeId: 'judge',
}

const overwrite = (update: UpdateCase): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, isUndefined)

  return validUpdates
}

export const fieldHasValue = (workingCase: Case) => (
  value: unknown,
  key: string,
) => {
  const theKey = key as keyof UpdateCase // loadash types are not better than this

  if (
    isChildKey(theKey) // check if key is f.example `judgeId`
      ? isNil(workingCase[childof[theKey]])
      : isNil(workingCase[theKey])
  ) {
    return value === undefined
  }

  return true
}

export const update = (update: UpdateCase, workingCase: Case): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, fieldHasValue(workingCase))

  return validUpdates
}

export const formatUpdates = (
  updates: Array<autofillEntry>,
  workingCase: Case,
) => {
  const changes: UpdateCase[] = updates.map((entry) => {
    if (entry.force) {
      return overwrite(entry)
    }
    return update(entry, workingCase)
  })

  const newWorkingCase = changes.reduce<UpdateCase>(
    (currentUpdates, nextUpdates) => {
      return { ...currentUpdates, ...nextUpdates }
    },
    {} as UpdateCase,
  )

  return newWorkingCase
}

export const formatDateForServer = (date: Date) => {
  return formatISO(date, { representation: 'complete' })
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
  ] = useMutation<UpdateCaseMutationResponse>(UpdateCaseMutation, {
    fetchPolicy: 'no-cache',
  })
  const [
    transitionCaseMutation,
    { loading: isTransitioningCase },
  ] = useMutation<TransitionCaseMutationResponse>(TransitionCaseMutation)
  const [
    sendNotificationMutation,
    { loading: isSendingNotification, error: sendNotificationError },
  ] = useMutation<SendNotificationMutationResponse>(SendNotificationMutation)
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
                indictmentSubtypes: theCase.indictmentSubtypes,
                description: theCase.description,
                policeCaseNumbers: theCase.policeCaseNumbers,
                defenderName: theCase.defenderName,
                defenderNationalId: theCase.defenderNationalId,
                defenderEmail: theCase.defenderEmail,
                defenderPhoneNumber: theCase.defenderPhoneNumber,
                sendRequestToDefender: theCase.sendRequestToDefender,
                leadInvestigator: theCase.leadInvestigator,
                crimeScenes: theCase.crimeScenes,
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
            setWorkingCase((theCase) => ({
              ...theCase,
              courtCaseNumber: data.createCourtCase.courtCaseNumber,
            }))

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
        if (!id || Object.keys(updateCase).length === 0) {
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
      caseId: string,
      transition: CaseTransition,
      setWorkingCase?: React.Dispatch<React.SetStateAction<Case>>,
    ): Promise<boolean> => {
      try {
        const { data } = await transitionCaseMutation({
          variables: {
            input: {
              id: caseId,
              transition,
            },
          },
        })

        if (!data?.transitionCase?.state) {
          return false
        }

        if (setWorkingCase) {
          setWorkingCase((theCase) => ({
            ...theCase,
            state: data.transitionCase.state,
          }))
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

  const setAndSendCaseToServer = async (
    updates: autofillEntry[],
    workingCase: Case,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => {
    try {
      const updatesToCase: autofillEntry = formatUpdates(updates, workingCase)
      delete updatesToCase.force

      if (Object.keys(updatesToCase).length === 0) {
        return
      }

      // The case has not been created
      if (!workingCase.id) {
        setWorkingCase((theCase) => ({ ...theCase, ...updatesToCase }))
        return
      }

      const newWorkingCase = await updateCase(workingCase.id, updatesToCase)

      if (!newWorkingCase) {
        throw new Error()
      }

      setWorkingCase((theCase) => ({ ...theCase, ...newWorkingCase }))
    } catch (error) {
      toast.error(formatMessage(errors.updateCase))
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
    sendNotificationError,
    requestCourtRecordSignature,
    isRequestingCourtRecordSignature,
    extendCase,
    isExtendingCase,
    setAndSendCaseToServer,
  }
}

export default useCase
