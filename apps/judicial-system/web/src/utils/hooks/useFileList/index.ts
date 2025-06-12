import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import { useGetSignedUrlLazyQuery } from './getSigendUrl.generated'
import { useLimitedAccessGetSignedUrlLazyQuery } from './limitedAccessGetSigendUrl.generated'

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

  const [
    getSignedUrl,
    { error: fullAccessError, variables: fullAccessVariables },
  ] = useGetSignedUrlLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted(data) {
      if (data?.getSignedUrl?.url) {
        openFile(data.getSignedUrl.url)
      }
    },
    onError: () => {
      toast.error(formatMessage(errors.openDocument))
    },
  })

  const [
    limitedAccessGetSignedUrl,
    { error: limitedAccessError, variables: limitedAccessVariables },
  ] = useLimitedAccessGetSignedUrlLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted(data) {
      if (data?.limitedAccessGetSignedUrl?.url) {
        openFile(data.limitedAccessGetSignedUrl.url)
      }
    },
    onError: () => {
      toast.error(formatMessage(errors.openDocument))
    },
  })

  useEffect(() => {
    const error = limitedAccess ? limitedAccessError : fullAccessError

    const variables = limitedAccess
      ? limitedAccessVariables
      : fullAccessVariables

    if (error && variables) {
      const code = error?.graphQLErrors[0].extensions?.code

      // If the file no longer exists or access in no longer permitted
      if (
        code === 'https://httpstatuses.org/404' ||
        code === 'https://httpstatuses.org/403'
      ) {
        setFileNotFound(true)
        setWorkingCase((prevWorkingCase) => ({
          ...prevWorkingCase,
          caseFiles: prevWorkingCase.caseFiles?.map((file) =>
            file.id === variables.input.id
              ? {
                  ...file,
                  key: undefined,
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
    fullAccessError,
    fullAccessVariables,
    limitedAccess,
    limitedAccessError,
    limitedAccessVariables,
    setWorkingCase,
  ])

  const onOpen = useMemo(
    () => (fileId: string) => {
      const query = limitedAccess ? limitedAccessGetSignedUrl : getSignedUrl

      query({
        variables: {
          input: {
            id: fileId,
            caseId: connectedCaseParentId ?? caseId,
            mergedCaseId: connectedCaseParentId && caseId,
          },
        },
      })
    },
    [
      caseId,
      connectedCaseParentId,
      getSignedUrl,
      limitedAccess,
      limitedAccessGetSignedUrl,
    ],
  )

  const onOpenFile = useMemo(
    () => (file: UploadFile) => {
      if (!file.id) {
        return
      }
      // if the file has an invalid id, we assume it is a temp id where the file hasn't been created in S3 yet
      // and we create a direct object url for preview purposes. We handle it specifically in the client to avoid internal server errors
      if (!validateUuid(file.id)) {
        const previewUrl = URL.createObjectURL(file.originalFileObj as Blob)
        openFile(previewUrl)
        setTimeout(() => URL.revokeObjectURL(previewUrl), 1000 * 60) // revoke url in 1 minute
      } else {
        const query = limitedAccess ? limitedAccessGetSignedUrl : getSignedUrl

        query({
          variables: {
            input: {
              id: file.id,
              caseId: connectedCaseParentId ?? caseId,
              mergedCaseId: connectedCaseParentId && caseId,
            },
          },
        })
      }
    },
    [
      caseId,
      connectedCaseParentId,
      getSignedUrl,
      limitedAccess,
      limitedAccessGetSignedUrl,
      openFile,
    ],
  )

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { fileNotFound, dismissFileNotFound, onOpen, onOpenFile }
}

export default useFileList
