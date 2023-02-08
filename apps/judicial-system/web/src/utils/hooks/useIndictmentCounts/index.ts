import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  IndictmentCount,
  UpdateIndictmentCountInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { UpdateIndictmentCountMutation } from './updateIndictmentCountGql'
import { CreateIndictmentCountMutation } from './createIndictmentCountGql'
import { DeleteIndictmentCountMutation } from './deleteIndictmentCountGql'

interface CreateIndictmentCountMutationResponse {
  createIndictmentCount: IndictmentCount
}

interface UpdateIndictmentCountMutationResponse {
  updateIndictmentCount: IndictmentCount
}

interface DeleteIndictmentCountMutationResponse {
  deleteIndictmentCount: {
    deleted: boolean
  }
}

export type UpdateIndictmentCount = Omit<
  UpdateIndictmentCountInput,
  'caseId' | 'indictmentCountId'
>

const useIndictmentCounts = () => {
  const { formatMessage } = useIntl()

  const [
    createIndictmentCountMutation,
  ] = useMutation<CreateIndictmentCountMutationResponse>(
    CreateIndictmentCountMutation,
  )
  const [
    updateIndictmentCountMutation,
  ] = useMutation<UpdateIndictmentCountMutationResponse>(
    UpdateIndictmentCountMutation,
  )

  const [
    deleteIndictmentCountMutation,
  ] = useMutation<DeleteIndictmentCountMutationResponse>(
    DeleteIndictmentCountMutation,
  )

  const createIndictmentCount = useCallback(
    async (caseId: string) => {
      try {
        const { data } = await createIndictmentCountMutation({
          variables: {
            input: {
              caseId,
            },
          },
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
          variables: {
            input: {
              caseId,
              indictmentCountId,
            },
          },
        })

        return data?.deleteIndictmentCount.deleted
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
          variables: {
            input: {
              indictmentCountId: indictmentCountId,
              caseId,
              ...update,
            },
          },
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

  return {
    updateIndictmentCount,
    createIndictmentCount,
    deleteIndictmentCount,
  }
}

export default useIndictmentCounts
