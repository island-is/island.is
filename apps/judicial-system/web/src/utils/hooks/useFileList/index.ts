import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { validate as validateUuid } from 'uuid'
import type { ApolloError } from '@apollo/client'

import type { UploadFile } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileState } from '@island.is/judicial-system-web/src/graphql/schema'
import useIsMobile from '@island.is/judicial-system-web/src/utils/hooks/useIsMobile/useIsMobile'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import type { GetSignedUrlQuery } from './getSignedUrl.generated'
import { useGetSignedUrlLazyQuery } from './getSignedUrl.generated'
import type { LimitedAccessGetSignedUrlQuery } from './limitedAccessGetSignedUrl.generated'
import { useLimitedAccessGetSignedUrlLazyQuery } from './limitedAccessGetSignedUrl.generated'

type LocalFilePreviewResult =
  | { action: 'createObjectURL'; blob: Blob }
  | { action: 'unavailable' }

export const resolveLocalFilePreview = (file: {
  originalFileObj?: File | Blob | null
}): LocalFilePreviewResult => {
  if (!file.originalFileObj) {
    return { action: 'unavailable' }
  }

  return { action: 'createObjectURL', blob: file.originalFileObj }
}

// A file the server reports missing or inaccessible. Consumers show these in
// the FileNotFoundModal, so they are not toasted as a failed download as well.
export const isFileNotFoundError = (
  error: Pick<ApolloError, 'graphQLErrors'>,
) => {
  const code = error.graphQLErrors?.[0]?.extensions?.code

  return (
    code === 'https://httpstatuses.org/404' ||
    code === 'https://httpstatuses.org/403'
  )
}

interface Parameters {
  caseId: string
  connectedCaseParentId?: string
}

const useFileList = ({ caseId, connectedCaseParentId }: Parameters) => {
  const { limitedAccess } = useContext(UserContext)
  const { setWorkingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const isMobile = useIsMobile()
  const [fileNotFound, setFileNotFound] = useState<boolean>()

  const openFile = useCallback(
    (url: string) => {
      window.open(url, isMobile ? '_self' : '_blank', 'noopener, noreferrer')
    },
    [isMobile],
  )

  const reportOpenFailure = useCallback(
    (error: ApolloError) => {
      if (!isFileNotFoundError(error)) {
        toast.error(formatMessage(errors.openDocument))
      }
    },
    [formatMessage],
  )

  // Lazy queries
  const [getSignedUrl, fullAccessQueryState] = useGetSignedUrlLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onError: reportOpenFailure,
  })

  const [limitedAccessGetSignedUrl, limitedAccessQueryState] =
    useLimitedAccessGetSignedUrlLazyQuery({
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      onError: reportOpenFailure,
    })

  // Error handling
  useEffect(() => {
    const error = limitedAccess
      ? limitedAccessQueryState.error
      : fullAccessQueryState.error
    const variables = limitedAccess
      ? limitedAccessQueryState.variables
      : fullAccessQueryState.variables

    if (error && variables) {
      if (isFileNotFoundError(error)) {
        setFileNotFound(true)
        setWorkingCase((prev) => ({
          ...prev,
          caseFiles: prev.caseFiles?.map((file) =>
            file.id === variables.input.id
              ? {
                  ...file,
                  isKeyAccessible: false,
                  status:
                    file.state === CaseFileState.STORED_IN_COURT
                      ? 'done-broken'
                      : 'broken',
                }
              : file,
          ),
        }))
      }
    }
  }, [
    limitedAccess,
    fullAccessQueryState.error,
    fullAccessQueryState.variables,
    limitedAccessQueryState.error,
    limitedAccessQueryState.variables,
    setWorkingCase,
  ])

  // Unified helper: get a signed URL
  // mergedCaseId names the merged case a single file belongs to, for a list
  // that is mostly this case's own files but holds a few from cases merged into
  // it - the court record, where a document copied in from a merged case still
  // points at that case's file. A list that is wholly a merged case's files
  // says so once, through connectedCaseParentId, and passes nothing here.
  const getFileUrl = useCallback(
    async (
      fileId: string,
      mergedCaseId?: string,
    ): Promise<string | undefined> => {
      const query = limitedAccess ? limitedAccessGetSignedUrl : getSignedUrl
      try {
        const { data } = await query({
          variables: {
            input: {
              id: fileId,
              caseId: connectedCaseParentId ?? caseId,
              mergedCaseId: mergedCaseId ?? (connectedCaseParentId && caseId),
            },
          },
        })

        // With errorPolicy 'all' a failed request resolves without data and
        // is reported by onError, so reading it must not throw into the catch.
        return limitedAccess
          ? (data as LimitedAccessGetSignedUrlQuery | undefined)
              ?.limitedAccessGetSignedUrl?.url
          : (data as GetSignedUrlQuery | undefined)?.getSignedUrl?.url
      } catch {
        toast.error(formatMessage(errors.openDocument))
        return undefined
      }
    },
    [
      limitedAccess,
      limitedAccessGetSignedUrl,
      getSignedUrl,
      connectedCaseParentId,
      caseId,
      formatMessage,
    ],
  )

  // Handlers
  const onOpen = useCallback(
    async (fileId: string, mergedCaseId?: string) => {
      const url = await getFileUrl(fileId, mergedCaseId)

      if (url) openFile(url)
    },
    [getFileUrl, openFile],
  )

  const onOpenFile = useCallback(
    async (file: UploadFile) => {
      if (!file.id) return

      if (!validateUuid(file.id)) {
        const localPreview = resolveLocalFilePreview(file)

        if (localPreview.action === 'unavailable') {
          toast.warning('Skjalið er ekki tilbúið')
          return
        }

        const previewUrl = URL.createObjectURL(localPreview.blob)
        openFile(previewUrl)
        setTimeout(() => URL.revokeObjectURL(previewUrl), 1000 * 60)
      } else {
        const url = await getFileUrl(file.id)
        if (url) openFile(url)
      }
    },
    [getFileUrl, openFile],
  )

  const dismissFileNotFound = () => setFileNotFound(false)

  return {
    fileNotFound,
    dismissFileNotFound,
    onOpen,
    onOpenFile,
    getFileUrl,
  }
}

export default useFileList
