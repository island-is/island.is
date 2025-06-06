import { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { toast, UploadFile } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileState } from '@island.is/judicial-system-web/src/graphql/schema'

import useIsMobile from '../useIsMobile/useIsMobile'
import { TUploadFile } from '../useS3Upload/useS3Upload'
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
  const [currentFile, setCurrentFile] = useState<TUploadFile | undefined>()

  const openFile = (url: string) => {
    window.open(url, isMobile ? '_self' : '_blank', 'noopener, noreferrer')
  }

  const onErrorOrPreviewURl = (currentFile: TUploadFile | undefined) => {
    if (currentFile && currentFile.id === fullAccessVariables?.input.id) {
      const previewUrl = URL.createObjectURL(
        currentFile.originalFileObj as Blob,
      )
      openFile(previewUrl)
    } else {
      toast.error(formatMessage(errors.openDocument))
    }
  }

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
      onErrorOrPreviewURl(currentFile)
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
      onErrorOrPreviewURl(currentFile)
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
    () => (file: UploadFile) => {
      if (!file.id) {
        return
      }
      setCurrentFile(file as File)

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
    },
    [
      caseId,
      connectedCaseParentId,
      getSignedUrl,
      limitedAccess,
      limitedAccessGetSignedUrl,
    ],
  )

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { fileNotFound, dismissFileNotFound, onOpen }
}

export default useFileList
