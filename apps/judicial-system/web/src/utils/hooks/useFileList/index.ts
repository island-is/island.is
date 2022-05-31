import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetSignedUrlQuery } from '@island.is/judicial-system-web/graphql/sharedGql'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { CaseFileState } from '@island.is/judicial-system/types'

interface Parameters {
  caseId?: string
}

const useFileList = ({ caseId }: Parameters) => {
  const { setWorkingCase } = useContext(FormContext)
  const [openFileId, setOpenFileId] = useState<string>()
  const [fileNotFound, setFileNotFound] = useState<boolean>()

  const { data: fileSignedUrl, error } = useQuery(GetSignedUrlQuery, {
    variables: {
      input: {
        id: openFileId,
        caseId: caseId,
      },
    },
    skip: !caseId || !openFileId,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    const handleError = (errorFileId?: string) => {
      const code = error?.graphQLErrors[0].extensions?.code

      // If the file no longer exists or access in no longer permitted
      if (
        code === 'https://httpstatuses.com/404' ||
        code === 'https://httpstatuses.com/403'
      ) {
        setFileNotFound(true)
        setWorkingCase((theCase) => ({
          ...theCase,
          caseFiles: theCase.caseFiles?.map((file) =>
            file.id === errorFileId
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

    if (fileSignedUrl) {
      window.open(fileSignedUrl.getSignedUrl.url, '_blank')
      setOpenFileId(undefined)
    } else if (error) {
      handleError(openFileId)
      setOpenFileId(undefined)
    }
  }, [fileSignedUrl, error, setWorkingCase, openFileId])

  const handleOpenFile = (fileId: string) => {
    setOpenFileId(fileId)
  }

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { handleOpenFile, fileNotFound, dismissFileNotFound }
}

export default useFileList
