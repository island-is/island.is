import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  CreateCourtDocumentInput,
  DeleteCourtDocumentInput,
  FileCourtDocumentInCourtSessionInput,
  UpdateCourtDocumentInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateCourtDocumentMutation } from './createCourtDocument.generated'
import { useDeleteCourtDocumentMutation } from './deleteCourtDocument.generated'
import { useFileCourtDocumentInCourtSessionMutation } from './fileCourtDocumentInCourt.generated'
import { useUpdateCourtDocumentMutation } from './updateCourtDocument.generated'

const useCourtDocuments = () => {
  const [updateCourtDocumentMutation] = useUpdateCourtDocumentMutation()
  const [createCourtDocumentMutation, { loading: createCourtDocumentLoading }] =
    useCreateCourtDocumentMutation()
  const [deleteCourtDocumentMutation] = useDeleteCourtDocumentMutation()
  const [fileCourtDocumentInCourtSessionMutation] =
    useFileCourtDocumentInCourtSessionMutation()

  const createCourtDocument = useCallback(
    async (createCourtDocumentInput: CreateCourtDocumentInput) => {
      try {
        const { data } = await createCourtDocumentMutation({
          variables: {
            input: createCourtDocumentInput,
          },
        })

        if (!data || !data.createCourtDocument) {
          throw new Error()
        }

        return {
          id: data.createCourtDocument.id,
          created: data.createCourtDocument.created,
        }
      } catch (error) {
        toast.error('Upp kom villa við að búa til þingskjal')

        return
      }
    },
    [createCourtDocumentMutation],
  )

  const updateCourtDocument = useCallback(
    async (updateCourtDocument: UpdateCourtDocumentInput) => {
      try {
        const { data } = await updateCourtDocumentMutation({
          variables: {
            input: updateCourtDocument,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra þingskjal')

        return false
      }
    },
    [updateCourtDocumentMutation],
  )

  const deleteCourtDocument = useCallback(
    async (deleteCourtDocument: DeleteCourtDocumentInput) => {
      try {
        const { data } = await deleteCourtDocumentMutation({
          variables: {
            input: deleteCourtDocument,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra þingskjal')

        return false
      }
    },
    [deleteCourtDocumentMutation],
  )

  const fileCourtDocumentInCourtSession = useCallback(
    async (
      fileCourtDocumentInCourtSession: FileCourtDocumentInCourtSessionInput,
    ) => {
      try {
        const { data } = await fileCourtDocumentInCourtSessionMutation({
          variables: {
            input: fileCourtDocumentInCourtSession,
          },
        })

        if (!data || !data.fileCourtDocumentInCourtSession) {
          throw new Error()
        }

        return data
      } catch (error) {
        toast.error('Upp kom villa við að leggja fram þingskjal')

        return false
      }
    },
    [fileCourtDocumentInCourtSessionMutation],
  )
  return {
    courtDocument: {
      create: createCourtDocument,
      isCreating: createCourtDocumentLoading,
    },
    updateCourtDocument,
    deleteCourtDocument,
    fileCourtDocumentInCourtSession,
  }
}

export default useCourtDocuments
