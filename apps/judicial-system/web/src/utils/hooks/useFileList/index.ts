import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetSignedUrlQuery } from '@island.is/judicial-system-web/graphql/sharedGql'

interface Parameters {
  caseId?: string
}

const useFileList = ({ caseId }: Parameters) => {
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
  })

  useEffect(() => {
    const handleError = () => {
      const status = error?.graphQLErrors[0].extensions?.response.status

      // If the file no longer exists or access in no longer permitted
      if (status === 404 || status === 403) {
        setFileNotFound(true)
      }
    }

    if (fileSignedUrl) {
      window.open(fileSignedUrl.getSignedUrl.url, '_blank')
    } else if (error) {
      handleError()
    }

    setOpenFileId(undefined)
  }, [fileSignedUrl, error])

  const handleOpenFile = (fileId: string) => {
    setOpenFileId(fileId)
  }

  const dismissFileNotFound = () => {
    setFileNotFound(false)
  }

  return { handleOpenFile, fileNotFound, dismissFileNotFound }
}

export default useFileList
