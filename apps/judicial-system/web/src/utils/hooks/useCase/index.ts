import { useMemo } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import formatISO from 'date-fns/formatISO'
import omitBy from 'lodash/omitBy'
import pickBy from 'lodash/pickBy'
import isUndefined from 'lodash/isUndefined'
import isNil from 'lodash/isNil'

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
  Institution,
  User,
} from '@island.is/judicial-system/types'
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

export type autofillEntry = Partial<UpdateCase> & {
  force?: boolean
}

export type autofillFunc = (
  entries: Array<autofillEntry>,
  workingCase: Case,
  setWorkingCase?: React.Dispatch<React.SetStateAction<Case>>,
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

const overwrite = (update: UpdateCase, workingCase: Case): Case => {
  const validUpdates = omitBy<UpdateCase>(update, isUndefined)

  return { ...workingCase, ...validUpdates }
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
    console.log('key', workingCase, key)
    return value === undefined
  }

  console.log('we should return here', value, key)
  return true
}

export const update = (update: UpdateCase, workingCase: Case): Case => {
  const validUpdates = omitBy<UpdateCase>(update, fieldHasValue(workingCase))
  console.log('validupdates', validUpdates)

  return { ...workingCase, ...validUpdates }
}

export const auto = (updates: Array<autofillEntry>, workingCase: Case) => {
  const u: Case[] = updates.map((entry) => {
    if (entry.force) {
      return overwrite(entry, workingCase)
    }
    return update(entry, workingCase)
  })

  const newWorkingCase = u.reduce<Case>((currentUpdates, nextUpdates) => {
    return { ...currentUpdates, ...nextUpdates }
  }, workingCase as Case)

  return newWorkingCase
}

export const autosync = async (
  updates: autofillEntry[],
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  updateCase: (id: string, update: UpdateCase) => Promise<Case | undefined>,
) => {
  const newWorkingCase: UpdateCase = auto(updates, workingCase)
  updateCase(workingCase.id, newWorkingCase)
  setWorkingCase({ ...workingCase, ...newWorkingCase })
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
        (item.force ||
          (isChildKey(item.key)
            ? workingCase[childof[item.key]] === undefined ||
              workingCase[childof[item.key]] === null
            : workingCase[item.key] === undefined ||
              workingCase[item.key] === null)),
    )

    if (validEntries.length === 0) {
      return
    }

    const setEntries = Object.assign(
      {},
      ...validEntries.map((entry) => ({
        [isChildKey(entry.key) ? childof[entry.key] : entry.key]:
          // Ensure dates are saved on a correct format
          entry.value instanceof Date
            ? formatISO(entry.value, {
                representation: 'complete',
              })
            : entry.value,
      })),
    )

    if (setWorkingCase) {
      setWorkingCase({ ...workingCase, ...setEntries })
    }

    const updateEntries = Object.assign(
      {},
      ...validEntries.map((entry) => ({
        [entry.key]: isChildKey(entry.key)
          ? (entry.value as Institution | User)?.id ?? null
          : // Ensure dates are saved on a correct format
          entry.value instanceof Date
          ? formatISO(entry.value, {
              representation: 'complete',
            })
          : entry.value,
      })),
    )

    updateCase(workingCase.id, updateEntries)
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
    autofill,
  }
}

export default useCase
