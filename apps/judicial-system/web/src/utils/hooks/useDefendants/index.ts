import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'

import { errors } from '@island.is/judicial-system-web/messages'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  CreateDefendantInput,
  UpdateDefendantInput,
  UpdateDefendantsItem,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { normalizeBlankStrings } from '../../formatters'
import { useCreateDefendantMutation } from './createDefendant.generated'
import { useDeleteDefendantMutation } from './deleteDefendant.generated'
import { useLimitedAccessUpdateDefendantMutation } from './limitedAccessUpdateDefendant.generated'
import { useUpdateDefendantMutation } from './updateDefendant.generated'
import { useUpdateDefendantsMutation } from './updateDefendants.generated'

const useDefendants = () => {
  const [createDefendantMutation, { loading: isCreatingDefendant }] =
    useCreateDefendantMutation()

  const [deleteDefendantMutation] = useDeleteDefendantMutation()

  // Defendant updates can move the case between case tables, so active
  // case table membership queries - the breadcrumbs - must be refetched.
  const [updateDefendantMutation, { loading: isUpdatingDefendant }] =
    useUpdateDefendantMutation({ refetchQueries: ['CaseTableMembership'] })

  const [updateDefendantsMutation] = useUpdateDefendantsMutation({
    refetchQueries: ['CaseTableMembership'],
  })

  const [limitedAccessUpdateDefendantMutation] =
    useLimitedAccessUpdateDefendantMutation({
      refetchQueries: ['CaseTableMembership'],
    })

  // Resolves to the new defendant's id, or undefined when the defendant was
  // not created. Every failure is reported here, so callers only need to
  // check the result before adding the defendant to the working case.
  const createDefendant = useCallback(
    async (defendant: CreateDefendantInput): Promise<string | undefined> => {
      if (isCreatingDefendant) {
        return undefined
      }

      try {
        const { data } = await createDefendantMutation({
          variables: {
            input: normalizeBlankStrings(defendant),
          },
        })

        const defendantId = data?.createDefendant?.id

        if (!defendantId) {
          throw new Error('No defendant id returned')
        }

        return defendantId
      } catch {
        toast.error(errors.createDefendant)

        return undefined
      }
    },
    [createDefendantMutation, isCreatingDefendant],
  )

  // Resolves to whether the defendant was deleted. The server can answer
  // without deleting, so that case is reported the same way as a failed
  // request and callers only need to check the result.
  const deleteDefendant = useCallback(
    async (caseId: string, defendantId: string): Promise<boolean> => {
      try {
        const { data } = await deleteDefendantMutation({
          variables: { input: { caseId, defendantId } },
        })

        if (!data?.deleteDefendant?.deleted) {
          throw new Error('Defendant was not deleted')
        }

        return true
      } catch {
        toast.error(errors.deleteDefendant)

        return false
      }
    },
    [deleteDefendantMutation],
  )

  const updateDefendant = useCallback(
    async (updateDefendant: UpdateDefendantInput) => {
      // Request cases keep a client-side defendant before "Stofna mál" creates
      // the case. Same as updateCase: keep local state, skip the API until both
      // ids exist (empty string is the FormProvider placeholder).
      if (!updateDefendant.caseId || !updateDefendant.defendantId) {
        return false
      }

      try {
        const { data } = await updateDefendantMutation({
          variables: {
            input: normalizeBlankStrings(updateDefendant),
          },
        })

        return Boolean(data)
      } catch {
        toast.error(errors.updateDefendant)

        return false
      }
    },
    [updateDefendantMutation],
  )

  // One request for many defendants of a case, so the server locks and reads
  // the case once instead of once per defendant. Nothing to send is a success.
  const updateDefendants = useCallback(
    async (caseId: string, defendants: UpdateDefendantsItem[]) => {
      if (defendants.length === 0) {
        return true
      }

      try {
        const { data } = await updateDefendantsMutation({
          variables: {
            input: {
              caseId,
              defendants: defendants.map((defendant) =>
                normalizeBlankStrings(defendant),
              ),
            },
          },
        })

        return Boolean(data?.updateDefendants)
      } catch {
        toast.error(errors.updateDefendant)

        return false
      }
    },
    [updateDefendantsMutation],
  )

  const limitedAccessUpdateDefendant = useCallback(
    async (updateDefendant: UpdateDefendantInput) => {
      if (!updateDefendant.caseId || !updateDefendant.defendantId) {
        return false
      }

      try {
        const { data } = await limitedAccessUpdateDefendantMutation({
          variables: {
            input: normalizeBlankStrings(updateDefendant),
          },
        })

        return Boolean(data)
      } catch {
        toast.error(errors.updateDefendant)

        return false
      }
    },
    [limitedAccessUpdateDefendantMutation],
  )

  const updateDefendantState = useCallback(
    (
      update: UpdateDefendantInput,
      setWorkingCase: Dispatch<SetStateAction<WorkingCase>>,
    ) => {
      setWorkingCase((prevWorkingCase: WorkingCase) => {
        if (!prevWorkingCase.defendants) {
          return prevWorkingCase
        }
        const indexOfDefendantToUpdate = prevWorkingCase.defendants.findIndex(
          (defendant) => defendant.id === update.defendantId,
        )

        const newDefendants = [...prevWorkingCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        }

        return { ...prevWorkingCase, defendants: newDefendants }
      })
    },
    [],
  )

  const setAndSendDefendantToServer = useCallback(
    (
      update: UpdateDefendantInput,
      setWorkingCase: Dispatch<SetStateAction<WorkingCase>>,
    ) => {
      updateDefendantState(update, setWorkingCase)

      return updateDefendant(update)
    },
    [updateDefendant, updateDefendantState],
  )

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
    updateDefendants,
    limitedAccessUpdateDefendant,
    isUpdatingDefendant,
    updateDefendantState,
    setAndSendDefendantToServer,
  }
}

export default useDefendants
