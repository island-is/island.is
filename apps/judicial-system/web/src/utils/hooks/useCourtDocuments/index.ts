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
  const [updateCourtDocumentMutation, { loading: updateCourtDocumentLoading }] =
    useUpdateCourtDocumentMutation()
  const [createCourtDocumentMutation, { loading: createCourtDocumentLoading }] =
    useCreateCourtDocumentMutation()
  const [deleteCourtDocumentMutation, { loading: deleteCourtDocumentLoading }] =
    useDeleteCourtDocumentMutation()
  const [
    fileCourtDocumentInCourtSessionMutation,
    { loading: fileCourtDocumentInCourtSessionLoading },
  ] = useFileCourtDocumentInCourtSessionMutation()

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

        return data.createCourtDocument
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

        return Boolean(data?.updateCourtDocument)
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

        return Boolean(data?.deleteCourtDocument)
      } catch (error) {
        toast.error('Upp kom villa við að eyða þingskjali')

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

        return data.fileCourtDocumentInCourtSession
      } catch (error) {
        toast.error('Upp kom villa við að leggja fram þingskjal')

        return
      }
    },
    [fileCourtDocumentInCourtSessionMutation],
  )

  return {
    courtDocument: {
      create: {
        action: createCourtDocument,
        loading: createCourtDocumentLoading,
      },
      update: {
        action: updateCourtDocument,
        loading: updateCourtDocumentLoading,
      },
      delete: {
        action: deleteCourtDocument,
        loading: deleteCourtDocumentLoading,
      },
      fileInCourtSession: {
        action: fileCourtDocumentInCourtSession,
        loading: fileCourtDocumentInCourtSessionLoading,
      },
      isLoading:
        createCourtDocumentLoading ||
        updateCourtDocumentLoading ||
        deleteCourtDocumentLoading ||
        fileCourtDocumentInCourtSessionLoading,
    },
  }
}

export default useCourtDocuments
