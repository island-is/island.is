import { Dispatch, SetStateAction, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  Case,
  Offense,
  UpdateIndictmentCountInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateIndictmentCountMutation } from './createIndictmentCount.generated'
import { useDeleteIndictmentCountMutation } from './deleteIndictmentCount.generated'
import { useUpdateIndictmentCountMutation } from './updateIndictmentCount.generated'

export interface UpdateIndictmentCount
  extends Omit<UpdateIndictmentCountInput, 'caseId' | 'indictmentCountId'> {}

const useIndictmentCounts = () => {
  const { formatMessage } = useIntl()

  const [createIndictmentCountMutation] = useCreateIndictmentCountMutation()
  const [updateIndictmentCountMutation] = useUpdateIndictmentCountMutation()
  const [deleteIndictmentCountMutation] = useDeleteIndictmentCountMutation()

  const createIndictmentCount = useCallback(
    async (caseId: string) => {
      try {
        const { data } = await createIndictmentCountMutation({
          variables: { input: { caseId } },
        })

        if (!data) {
          toast.error(formatMessage(errors.createIndictmentCount))
        }

        return data?.createIndictmentCount
      } catch (e) {
        toast.error(formatMessage(errors.createIndictmentCount))
      }
    },
    [createIndictmentCountMutation, formatMessage],
  )

  const deleteIndictmentCount = useCallback(
    async (caseId: string, indictmentCountId: string) => {
      try {
        const { data } = await deleteIndictmentCountMutation({
          variables: { input: { caseId, indictmentCountId } },
        })

        return data?.deleteIndictmentCount?.deleted
      } catch (e) {
        toast.error(formatMessage(errors.deleteIndictmentCount))
      }
    },
    [deleteIndictmentCountMutation, formatMessage],
  )

  const updateIndictmentCount = useCallback(
    async (
      caseId: string,
      indictmentCountId: string,
      update: UpdateIndictmentCount,
    ) => {
      try {
        const { data } = await updateIndictmentCountMutation({
          variables: { input: { indictmentCountId, caseId, ...update } },
        })

        if (!data) {
          toast.error(formatMessage(errors.updateIndictmentCount))
        }

        return data?.updateIndictmentCount
      } catch (e) {
        toast.error(formatMessage(errors.updateIndictmentCount))
      }
    },
    [updateIndictmentCountMutation, formatMessage],
  )

  const updateIndictmentCountState = useCallback(
    (
      indictmentCountId: string,
      update: UpdateIndictmentCount,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
      updatedOffenses?: Offense[],
    ) => {
      setWorkingCase((prevWorkingCase) => {
        if (!prevWorkingCase.indictmentCounts) {
          return prevWorkingCase
        }

        const indictmentCountIndexToUpdate =
          prevWorkingCase.indictmentCounts.findIndex(
            (indictmentCount) => indictmentCount.id === indictmentCountId,
          )

        const newIndictmentCounts = [...prevWorkingCase.indictmentCounts]

        newIndictmentCounts[indictmentCountIndexToUpdate] = {
          ...newIndictmentCounts[indictmentCountIndexToUpdate],
          ...update,
          ...(updatedOffenses ? { offenses: updatedOffenses } : {}),
        }

        return { ...prevWorkingCase, indictmentCounts: newIndictmentCounts }
      })
    },
    [],
  )

  return {
    updateIndictmentCount,
    createIndictmentCount,
    deleteIndictmentCount,
    updateIndictmentCountState,
  }
}

export default useIndictmentCounts
