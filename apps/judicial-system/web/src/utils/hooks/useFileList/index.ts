import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { validate as validateUuid } from 'uuid'

import { toast, UploadFile } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileState } from '@island.is/judicial-system-web/src/graphql/schema'

import useIsMobile from '../useIsMobile/useIsMobile'
import {
  GetSignedUrlQuery,
  useGetSignedUrlLazyQuery,
} from './getSigendUrl.generated'
import {
  LimitedAccessGetSignedUrlQuery,
  useLimitedAccessGetSignedUrlLazyQuery,
} from './limitedAccessGetSigendUrl.generated'

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

  // Lazy queries
  const [getSignedUrl, fullAccessQueryState] = useGetSignedUrlLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onError: () => toast.error(formatMessage(errors.openDocument)),
  })

  const [limitedAccessGetSignedUrl, limitedAccessQueryState] =
    useLimitedAccessGetSignedUrlLazyQuery({
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
      onError: () => toast.error(formatMessage(errors.openDocument)),
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
      const code = error.graphQLErrors?.[0]?.extensions?.code
      if (
        code === 'https://httpstatuses.org/404' ||
        code === 'https://httpstatuses.org/403'
      ) {
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
  const getFileUrl = useCallback(
    async (fileId: string): Promise<string | undefined> => {
      const query = limitedAccess ? limitedAccessGetSignedUrl : getSignedUrl
      try {
        const { data } = await query({
          variables: {
            input: {
              id: fileId,
              caseId: connectedCaseParentId ?? caseId,
              mergedCaseId: connectedCaseParentId && caseId,
            },
          },
        })

        return limitedAccess
          ? (data as LimitedAccessGetSignedUrlQuery).limitedAccessGetSignedUrl
              ?.url
          : (data as GetSignedUrlQuery).getSignedUrl?.url
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
    async (fileId: string) => {
      const url = await getFileUrl(fileId)

      if (url) openFile(url)
    },
    [getFileUrl, openFile],
  )

  const onOpenFile = useCallback(
    async (file: UploadFile) => {
      if (!file.id) return

      if (!validateUuid(file.id)) {
        const previewUrl = URL.createObjectURL(file.originalFileObj as Blob)
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
