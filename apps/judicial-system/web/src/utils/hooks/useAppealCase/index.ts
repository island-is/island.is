import type { Dispatch, SetStateAction } from 'react'
import { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import type {
  AppealCase,
  AppealCaseTransition,
  AppealEventType,
  Case,
  UpdateAppealCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import { applyAppealCaseUpdate } from '@island.is/judicial-system-web/src/utils/utils'

import type { CreateAppealCaseMutation } from './createAppealCase.generated'
import { useCreateAppealCaseMutation } from './createAppealCase.generated'
import { useCreateAppealEventLogMutation } from './createAppealEventLog.generated'
import type { LimitedAccessCreateAppealCaseMutation } from './limitedAccessCreateAppealCase.generated'
import { useLimitedAccessCreateAppealCaseMutation } from './limitedAccessCreateAppealCase.generated'
import { useLimitedAccessCreateAppealEventLogMutation } from './limitedAccessCreateAppealEventLog.generated'
import { useLimitedAccessCreateVerdictAppealMutation } from './limitedAccessCreateVerdictAppeal.generated'
import type { LimitedAccessTransitionAppealCaseMutation } from './limitedAccessTransitionAppealCase.generated'
import { useLimitedAccessTransitionAppealCaseMutation } from './limitedAccessTransitionAppealCase.generated'
import type { TransitionAppealCaseMutation } from './transitionAppealCase.generated'
import { useTransitionAppealCaseMutation } from './transitionAppealCase.generated'
import { useUpdateAppealCaseMutation } from './updateAppealCase.generated'

type UpdateAppealCase = Omit<UpdateAppealCaseInput, 'caseId' | 'appealCaseId'>

const useAppealCase = () => {
  const { limitedAccess } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const [createAppealCaseMutation, { loading: isCreatingAppealCase }] =
    useCreateAppealCaseMutation()
  const [
    limitedAccessCreateAppealCaseMutation,
    { loading: isLimitedAccessCreatingAppealCase },
  ] = useLimitedAccessCreateAppealCaseMutation()
  const [
    limitedAccessCreateVerdictAppealMutation,
    { loading: isCreatingVerdictAppeal },
  ] = useLimitedAccessCreateVerdictAppealMutation()
  const [transitionAppealCaseMutation, { loading: isTransitioningAppealCase }] =
    useTransitionAppealCaseMutation()
  const [
    limitedAccessTransitionAppealCaseMutation,
    { loading: isLimitedAccessTransitioningAppealCase },
  ] = useLimitedAccessTransitionAppealCaseMutation()
  const [updateAppealCaseMutation, { loading: isUpdatingAppealCase }] =
    useUpdateAppealCaseMutation()
  const [createAppealEventLogMutation, { loading: isCreatingAppealEventLog }] =
    useCreateAppealEventLogMutation()
  const [
    limitedAccessCreateAppealEventLogMutation,
    { loading: isLimitedAccessCreatingAppealEventLog },
  ] = useLimitedAccessCreateAppealEventLogMutation()

  const createAppealCase = useMemo(
    () =>
      async (
        caseId: string,
        rulingFileId?: string,
        setWorkingCase?: Dispatch<SetStateAction<Case>>,
      ): Promise<AppealCase | undefined> => {
        const mutation = limitedAccess
          ? limitedAccessCreateAppealCaseMutation
          : createAppealCaseMutation

        const resultType = limitedAccess
          ? 'limitedAccessCreateAppealCase'
          : 'createAppealCase'

        try {
          const { data } = await mutation({
            variables: { input: { caseId, rulingFileId } },
          })

          const res = data as CreateAppealCaseMutation &
            LimitedAccessCreateAppealCaseMutation

          const appealCase = res?.[resultType]

          if (!appealCase) {
            return undefined
          }

          if (setWorkingCase) {
            setWorkingCase((prevWorkingCase) => ({
              ...prevWorkingCase,
              appealCase: {
                ...prevWorkingCase.appealCase,
                ...appealCase,
              },
            }))
          }

          return appealCase
        } catch (e) {
          toast.error(formatMessage(errors.transitionCase))
          return undefined
        }
      },
    [
      limitedAccess,
      limitedAccessCreateAppealCaseMutation,
      createAppealCaseMutation,
      formatMessage,
    ],
  )

  // A defender files a verdict appeal - the appeal of an indictment verdict - for one
  // specific defendant. Always limited access: only defence users can.
  const createVerdictAppeal = useMemo(
    () =>
      async (
        caseId: string,
        defendantId: string,
      ): Promise<AppealCase | undefined> => {
        try {
          const { data } = await limitedAccessCreateVerdictAppealMutation({
            variables: {
              input: {
                caseId,
                defendantId,
                appealType: AppealCaseType.VERDICT,
              },
            },
          })

          return data?.limitedAccessCreateAppealCase ?? undefined
        } catch (e) {
          toast.error(formatMessage(errors.transitionCase))
          return undefined
        }
      },
    [limitedAccessCreateVerdictAppealMutation, formatMessage],
  )

  const transitionAppealCase = useMemo(
    () =>
      async (
        caseId: string,
        appealCaseId: string,
        transition: AppealCaseTransition,
        setWorkingCase?: Dispatch<SetStateAction<Case>>,
        // Withdrawing a verdict appeal is per defendant; every other transition
        // ignores this.
        defendantId?: string,
      ): Promise<boolean> => {
        const mutation = limitedAccess
          ? limitedAccessTransitionAppealCaseMutation
          : transitionAppealCaseMutation

        const resultType = limitedAccess
          ? 'limitedAccessTransitionAppealCase'
          : 'transitionAppealCase'

        try {
          const { data } = await mutation({
            variables: {
              input: { caseId, appealCaseId, transition, defendantId },
            },
          })

          const res = data as TransitionAppealCaseMutation &
            LimitedAccessTransitionAppealCaseMutation

          const appealCase = res?.[resultType]

          if (!appealCase?.appealState) {
            return false
          }

          if (setWorkingCase) {
            setWorkingCase((prevWorkingCase) =>
              applyAppealCaseUpdate(
                prevWorkingCase,
                appealCaseId,
                appealCase as Partial<AppealCase>,
              ),
            )
          }

          return true
        } catch (e) {
          toast.error(formatMessage(errors.transitionCase))
          return false
        }
      },
    [
      limitedAccess,
      limitedAccessTransitionAppealCaseMutation,
      transitionAppealCaseMutation,
      formatMessage,
    ],
  )

  const updateAppealCase = useMemo(
    () =>
      async (
        caseId: string,
        appealCaseId: string,
        update: UpdateAppealCase,
      ): Promise<AppealCase | undefined> => {
        try {
          if (Object.keys(update).length === 0) {
            return undefined
          }

          const { data } = await updateAppealCaseMutation({
            variables: {
              input: { caseId, appealCaseId, ...update },
            },
          })

          return data?.updateAppealCase as AppealCase | undefined
        } catch (e) {
          toast.error(formatMessage(errors.updateCase))
          return undefined
        }
      },
    [updateAppealCaseMutation, formatMessage],
  )

  const createAppealEventLog = useMemo(
    () =>
      async (
        caseId: string,
        appealCaseId: string,
        eventType: AppealEventType,
      ): Promise<boolean> => {
        const mutation = limitedAccess
          ? limitedAccessCreateAppealEventLogMutation
          : createAppealEventLogMutation

        try {
          const { data } = await mutation({
            variables: { input: { caseId, appealCaseId, eventType } },
          })

          return Boolean(data)
        } catch (e) {
          toast.error(formatMessage(errors.updateCase))
          return false
        }
      },
    [
      limitedAccess,
      limitedAccessCreateAppealEventLogMutation,
      createAppealEventLogMutation,
      formatMessage,
    ],
  )

  return {
    createAppealCase,
    createVerdictAppeal,
    isCreatingAppealCase:
      isCreatingAppealCase ||
      isLimitedAccessCreatingAppealCase ||
      isCreatingVerdictAppeal,
    transitionAppealCase,
    isTransitioningAppealCase:
      isTransitioningAppealCase || isLimitedAccessTransitioningAppealCase,
    updateAppealCase,
    isUpdatingAppealCase,
    createAppealEventLog,
    isCreatingAppealEventLog:
      isCreatingAppealEventLog || isLimitedAccessCreatingAppealEventLog,
  }
}

export default useAppealCase
