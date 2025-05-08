import { useCallback } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { SubstanceMap } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  IndictmentCountOffense,
  UpdateOffenseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateOffenseMutation } from './createOffense.generated'
import { useDeleteOffenseMutation } from './deleteOffense.generated'
import { useUpdateOffenseMutation } from './updateOffense.generated'

export interface UpdateOffense
  extends Omit<
    UpdateOffenseInput,
    'caseId' | 'indictmentCountId' | 'offenseId' | 'substances'
  > {
  substances?: SubstanceMap | null
}

const useOffenses = () => {
  const { formatMessage } = useIntl()

  const [createOffenseMutation] = useCreateOffenseMutation()
  const [updateOffenseMutation] = useUpdateOffenseMutation()
  const [deleteOffenseMutation] = useDeleteOffenseMutation()

  const createOffense = useCallback(
    async (
      caseId: string,
      indictmentCountId: string,
      offense: IndictmentCountOffense,
    ) => {
      try {
        const { data } = await createOffenseMutation({
          variables: {
            input: {
              caseId,
              indictmentCountId,
              offense,
            },
          },
        })

        if (!data) {
          toast.error(formatMessage(errors.createOffense))
        }

        return data?.createOffense
      } catch (e) {
        toast.error(formatMessage(errors.createOffense))
      }
    },
    [createOffenseMutation, formatMessage],
  )

  const deleteOffense = useCallback(
    async (caseId: string, indictmentCountId: string, offenseId: string) => {
      try {
        const { data } = await deleteOffenseMutation({
          variables: {
            input: {
              caseId,
              indictmentCountId,
              offenseId,
            },
          },
        })

        return data?.deleteOffense?.deleted
      } catch (e) {
        toast.error(formatMessage(errors.deleteOffense))
      }
    },
    [deleteOffenseMutation, formatMessage],
  )

  const updateOffense = useCallback(
    async (
      caseId: string,
      indictmentCountId: string,
      offenseId: string,
      update: UpdateOffense,
    ) => {
      try {
        const { data } = await updateOffenseMutation({
          variables: {
            input: {
              caseId,
              indictmentCountId,
              offenseId,
              ...update,
            },
          },
        })

        if (!data) {
          toast.error(formatMessage(errors.updateOffense))
        }
        return data?.updateOffense
      } catch (e) {
        toast.error(formatMessage(errors.updateOffense))
      }
    },
    [updateOffenseMutation, formatMessage],
  )

  return {
    updateOffense,
    createOffense,
    deleteOffense,
  }
}

export default useOffenses
