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

  const handleError = () => {
    error?.graphQLErrors[0].extensions?.response.status === 404 &&
      setFileNotFound(true)
  }

  return { handleOpenFile, fileNotFound }
}

export default useFileList
