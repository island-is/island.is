import { Dispatch, SetStateAction, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateCaseMutation } from './createCase.generated'
import { useCreateCourtCaseMutation } from './createCourtCase.generated'
import { useExtendCaseMutation } from './extendCase.generated'
import {
  LimitedAccessTransitionCaseMutation,
  useLimitedAccessTransitionCaseMutation,
} from './limitedAccessTransitionCase.generated'
import {
  LimitedAccessUpdateCaseMutation,
  useLimitedAccessUpdateCaseMutation,
} from './limitedAccessUpdateCase.generated'
import { useSendNotificationMutation } from './sendNotification.generated'
import {
  TransitionCaseMutation,
  useTransitionCaseMutation,
} from './transitionCase.generated'
import {
  UpdateCaseMutation,
  useUpdateCaseMutation,
} from './updateCase.generated'
import { formatUpdates, UpdateCase } from './useCase.logic'

const useCase = () => {
  const { limitedAccess } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const [createCaseMutation, { loading: isCreatingCase }] =
    useCreateCaseMutation()

  const [createCourtCaseMutation, { loading: isCreatingCourtCase }] =
    useCreateCourtCaseMutation()

  const [updateCaseMutation, { loading: isUpdatingCase }] =
    useUpdateCaseMutation()

  const [
    limitedAccessUpdateCaseMutation,
    { loading: isLimitedAccessUpdatingCase },
  ] = useLimitedAccessUpdateCaseMutation()

  const [transitionCaseMutation, { loading: isTransitioningCase }] =
    useTransitionCaseMutation()

  const [
    limitedAccessTransitionCaseMutation,
    { loading: isLimitedAccessTransitioningCase },
  ] = useLimitedAccessTransitionCaseMutation()

  const [
    sendNotificationMutation,
    { loading: isSendingNotification, error: sendNotificationError },
  ] = useSendNotificationMutation()

  const [extendCaseMutation, { loading: isExtendingCase }] =
    useExtendCaseMutation()

  const createCase = useMemo(
    () =>
      async (theCase: Case): Promise<Case | undefined> => {
        try {
          if (isCreatingCase === false) {
            if (!theCase.type || !theCase.policeCaseNumbers) {
              throw new Error('Missing required fields')
            }

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
                  requestSharedWithDefender: theCase.requestSharedWithDefender,
                  leadInvestigator: theCase.leadInvestigator,
                  crimeScenes: theCase.crimeScenes,
                  prosecutorId: theCase.prosecutor?.id,
                },
              },
            })

            if (data) {
              return data.createCase as Case
            }
          }
        } catch (error) {
          toast.error(formatMessage(errors.createCase))
        }
      },
    [createCaseMutation, formatMessage, isCreatingCase],
  )

  const createCourtCase = useMemo(
    () =>
      async (
        workingCase: Case,
        setWorkingCase: Dispatch<SetStateAction<Case>>,
      ): Promise<string> => {
        try {
          if (isCreatingCourtCase === false) {
            const { data, errors } = await createCourtCaseMutation({
              variables: { input: { caseId: workingCase.id } },
            })

            if (data?.createCourtCase?.courtCaseNumber && !errors) {
              setWorkingCase((prevWorkingCase) => ({
                ...prevWorkingCase,
                courtCaseNumber: (data.createCourtCase as Case).courtCaseNumber,
              }))

              return data.createCourtCase.courtCaseNumber
            }
          }
        } catch (error) {
          // Catch all so we can return the empty string
        }

        return ''
      },
    [createCourtCaseMutation, isCreatingCourtCase],
  )

  const updateLimitedAccessCase = useMemo(
    () => async (id: string, updateCase: UpdateCase) => {
      const mutation = limitedAccessUpdateCaseMutation

      try {
        if (!id || Object.keys(updateCase).length === 0) {
          return
        }

        const { data } = await mutation({
          variables: { input: { id, ...updateCase } },
        })

        const res = data as LimitedAccessUpdateCaseMutation

        return res.limitedAccessUpdateCase
      } catch (error) {
        toast.error(formatMessage(errors.updateCase))
      }
    },
    [formatMessage, limitedAccessUpdateCaseMutation],
  )

  const updateUnlimitedAccessCase = useMemo(
    () => async (id: string, updateCase: UpdateCase) => {
      const mutation = updateCaseMutation

      try {
        if (!id || Object.keys(updateCase).length === 0) {
          return
        }

        const { data } = await mutation({
          variables: { input: { id, ...updateCase } },
        })

        const res = data as UpdateCaseMutation

        return res.updateCase
      } catch (error) {
        toast.error(formatMessage(errors.updateCase))
      }
    },
    [formatMessage, updateCaseMutation],
  )

  const updateCase = useMemo(
    () => async (id: string, updateCase: UpdateCase) => {
      return limitedAccess
        ? updateLimitedAccessCase(id, updateCase)
        : updateUnlimitedAccessCase(id, updateCase)
    },
    [limitedAccess, updateLimitedAccessCase, updateUnlimitedAccessCase],
  )

  const transitionCase = useMemo(
    () =>
      async (
        caseId: string,
        transition: CaseTransition,
        setWorkingCase?: Dispatch<SetStateAction<Case>>,
      ): Promise<boolean> => {
        const mutation = limitedAccess
          ? limitedAccessTransitionCaseMutation
          : transitionCaseMutation

        const resultType = limitedAccess
          ? 'limitedAccessTransitionCase'
          : 'transitionCase'

        try {
          const { data } = await mutation({
            variables: {
              input: {
                id: caseId,
                transition,
              },
            },
          })

          const res = data as TransitionCaseMutation &
            LimitedAccessTransitionCaseMutation

          const state = res?.[resultType]?.state
          const appealState = res?.[resultType]?.appealState

          if (!state && !appealState) {
            return false
          }

          if (setWorkingCase) {
            setWorkingCase((prevWorkingCase) => ({
              ...prevWorkingCase,
              ...(res[resultType] as Case),
            }))
          }

          return true
        } catch (e) {
          toast.error(formatMessage(errors.transitionCase))

          return false
        }
      },
    [
      limitedAccess,
      limitedAccessTransitionCaseMutation,
      transitionCaseMutation,
      formatMessage,
    ],
  )

  const sendNotification = useMemo(
    () =>
      async (
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
    updates: UpdateCase[],
    workingCase: Case,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => {
    try {
      const updatesToCase: UpdateCase = formatUpdates(updates, workingCase)
      delete updatesToCase.force

      if (Object.keys(updatesToCase).length === 0) {
        return false
      }

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        ...updatesToCase,
      }))

      if (!workingCase.id) {
        return false
      }

      const newWorkingCase = await updateCase(workingCase.id, updatesToCase)

      if (!newWorkingCase) {
        return false
      }

      return true
    } catch (error) {
      toast.error(formatMessage(errors.updateCase))

      return false
    }
  }

  return {
    createCase,
    isCreatingCase,
    createCourtCase,
    isCreatingCourtCase,
    updateCase,
    updateLimitedAccessCase,
    updateUnlimitedAccessCase,
    isUpdatingCase: isUpdatingCase || isLimitedAccessUpdatingCase,
    transitionCase,
    isTransitioningCase:
      isTransitioningCase || isLimitedAccessTransitioningCase,
    sendNotification,
    isSendingNotification,
    sendNotificationError,
    extendCase,
    isExtendingCase,
    setAndSendCaseToServer,
  }
}

export default useCase
