import { Dispatch, SetStateAction, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCase,
  AppealCaseTransition,
  Case,
  UpdateAppealCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import {
  CreateAppealCaseMutation,
  useCreateAppealCaseMutation,
} from './createAppealCase.generated'
import {
  LimitedAccessCreateAppealCaseMutation,
  useLimitedAccessCreateAppealCaseMutation,
} from './limitedAccessCreateAppealCase.generated'
import {
  LimitedAccessTransitionAppealCaseMutation,
  useLimitedAccessTransitionAppealCaseMutation,
} from './limitedAccessTransitionAppealCase.generated'
import {
  LimitedAccessUpdateAppealCaseMutation,
  useLimitedAccessUpdateAppealCaseMutation,
} from './limitedAccessUpdateAppealCase.generated'
import {
  TransitionAppealCaseMutation,
  useTransitionAppealCaseMutation,
} from './transitionAppealCase.generated'
import {
  UpdateAppealCaseMutation,
  useUpdateAppealCaseMutation,
} from './updateAppealCase.generated'

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
    transitionAppealCaseMutation,
    { loading: isTransitioningAppealCase },
  ] = useTransitionAppealCaseMutation()
  const [
    limitedAccessTransitionAppealCaseMutation,
    { loading: isLimitedAccessTransitioningAppealCase },
  ] = useLimitedAccessTransitionAppealCaseMutation()
  const [updateAppealCaseMutation, { loading: isUpdatingAppealCase }] =
    useUpdateAppealCaseMutation()
  const [
    limitedAccessUpdateAppealCaseMutation,
    { loading: isLimitedAccessUpdatingAppealCase },
  ] = useLimitedAccessUpdateAppealCaseMutation()

  const createAppealCase = useMemo(
    () =>
      async (
        caseId: string,
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
            variables: { input: { caseId } },
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

  const transitionAppealCase = useMemo(
    () =>
      async (
        caseId: string,
        appealCaseId: string,
        transition: AppealCaseTransition,
        setWorkingCase?: Dispatch<SetStateAction<Case>>,
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
              input: { caseId, appealCaseId, transition },
            },
          })

          const res = data as TransitionAppealCaseMutation &
            LimitedAccessTransitionAppealCaseMutation

          const appealCase = res?.[resultType]

          if (!appealCase?.appealState) {
            return false
          }

          if (setWorkingCase) {
            setWorkingCase((prevWorkingCase) => ({
              ...prevWorkingCase,
              appealCase: {
                ...prevWorkingCase.appealCase,
                ...appealCase,
              } as AppealCase,
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
        update: Omit<UpdateAppealCaseInput, 'caseId' | 'appealCaseId'>,
      ): Promise<AppealCase | undefined> => {
        const mutation = limitedAccess
          ? limitedAccessUpdateAppealCaseMutation
          : updateAppealCaseMutation

        const resultType = limitedAccess
          ? 'limitedAccessUpdateAppealCase'
          : 'updateAppealCase'

        try {
          if (Object.keys(update).length === 0) {
            return undefined
          }

          const { data } = await mutation({
            variables: {
              input: { caseId, appealCaseId, ...update },
            },
          })

          const res = data as UpdateAppealCaseMutation &
            LimitedAccessUpdateAppealCaseMutation

          return res?.[resultType] as AppealCase | undefined
        } catch (e) {
          toast.error(formatMessage(errors.updateCase))
          return undefined
        }
      },
    [
      limitedAccess,
      limitedAccessUpdateAppealCaseMutation,
      updateAppealCaseMutation,
      formatMessage,
    ],
  )

  return {
    createAppealCase,
    isCreatingAppealCase:
      isCreatingAppealCase || isLimitedAccessCreatingAppealCase,
    transitionAppealCase,
    isTransitioningAppealCase:
      isTransitioningAppealCase || isLimitedAccessTransitioningAppealCase,
    updateAppealCase,
    isUpdatingAppealCase:
      isUpdatingAppealCase || isLimitedAccessUpdatingAppealCase,
  }
}

export default useAppealCase
