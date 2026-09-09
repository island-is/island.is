import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

import { errors } from '@island.is/judicial-system-web/messages'
import type {
  Case,
  CreateDefendantInput,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { normalizeBlankStrings } from '../../formatters'
import { useCreateDefendantMutation } from './createDefendant.generated'
import { useDeleteDefendantMutation } from './deleteDefendant.generated'
import { useLimitedAccessUpdateDefendantMutation } from './limitedAccessUpdateDefendant.generated'
import { useUpdateDefendantMutation } from './updateDefendant.generated'

const useDefendants = () => {
  const { formatMessage } = useIntl()

  const [createDefendantMutation, { loading: isCreatingDefendant }] =
    useCreateDefendantMutation()

  const [deleteDefendantMutation] = useDeleteDefendantMutation()

  // Defendant updates can move the case between case tables, so active
  // case table membership queries - the breadcrumbs - must be refetched.
  const [updateDefendantMutation, { loading: isUpdatingDefendant }] =
    useUpdateDefendantMutation({ refetchQueries: ['CaseTableMembership'] })

  const [limitedAccessUpdateDefendantMutation] =
    useLimitedAccessUpdateDefendantMutation({
      refetchQueries: ['CaseTableMembership'],
    })

  const createDefendant = useCallback(
    async (defendant: CreateDefendantInput) => {
      try {
        if (!isCreatingDefendant) {
          const { data } = await createDefendantMutation({
            variables: {
              input: normalizeBlankStrings(defendant),
            },
          })

          if (data) {
            return data.createDefendant?.id
          }
        }
      } catch (error) {
        toast.error(formatMessage(errors.createDefendant))
      }
    },
    [createDefendantMutation, formatMessage, isCreatingDefendant],
  )

  const deleteDefendant = useCallback(
    async (caseId: string, defendantId: string) => {
      try {
        const { data } = await deleteDefendantMutation({
          variables: { input: { caseId, defendantId } },
        })

        return Boolean(data?.deleteDefendant?.deleted)
      } catch (error) {
        toast.error(formatMessage(errors.deleteDefendant))

        return false
      }
    },
    [deleteDefendantMutation, formatMessage],
  )

  const updateDefendant = useCallback(
    async (updateDefendant: UpdateDefendantInput) => {
      try {
        const { data } = await updateDefendantMutation({
          variables: {
            input: normalizeBlankStrings(updateDefendant),
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error(formatMessage(errors.updateDefendant))

        return false
      }
    },
    [formatMessage, updateDefendantMutation],
  )

  const limitedAccessUpdateDefendant = useCallback(
    async (updateDefendant: UpdateDefendantInput) => {
      try {
        const { data } = await limitedAccessUpdateDefendantMutation({
          variables: {
            input: normalizeBlankStrings(updateDefendant),
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error(formatMessage(errors.updateDefendant))

        return false
      }
    },
    [formatMessage, limitedAccessUpdateDefendantMutation],
  )

  const updateDefendantState = useCallback(
    (
      update: UpdateDefendantInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      setWorkingCase((prevWorkingCase: Case) => {
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
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      updateDefendantState(update, setWorkingCase)
      updateDefendant(update)
    },
    [updateDefendant, updateDefendantState],
  )

  return {
    createDefendant,
    deleteDefendant,
    updateDefendant,
    limitedAccessUpdateDefendant,
    isUpdatingDefendant,
    updateDefendantState,
    setAndSendDefendantToServer,
  }
}

export default useDefendants
