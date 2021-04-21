import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GetSignedUrlQuery } from '@island.is/judicial-system-web/graphql/sharedGql'

interface Parameters {
  caseId?: string
}

const useFileList = ({ caseId }: Parameters) => {
  const [openFileId, setOpenFileId] = useState<string>()

  const { data: fileSignedUrl } = useQuery(GetSignedUrlQuery, {
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
      setOpenFileId(undefined)
    }
  }, [fileSignedUrl])

  const handleOpenFile = (fileId: string) => {
    setOpenFileId(fileId)
  }

  return { handleOpenFile }
}

export default useFileList
