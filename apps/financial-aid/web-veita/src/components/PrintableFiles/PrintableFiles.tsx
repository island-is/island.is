import React from 'react'
import {
  getFileType,
  GetSignedUrlForAllFiles,
  isImage,
} from '@island.is/financial-aid/shared/lib'
import { useQuery } from '@apollo/client'
import {
  Box,
  Button,
  SkeletonLoader,
  PdfViewer,
} from '@island.is/island-ui/core'
import { GetAllSignedUrlQuery } from '@island.is/financial-aid-web/veita/graphql'

interface Props {
  applicationId: string
}

const PrintableFiles = ({ applicationId }: Props) => {
  const { data, loading } = useQuery<GetSignedUrlForAllFiles>(
    GetAllSignedUrlQuery,
    {
      variables: { input: { id: applicationId } },
      errorPolicy: 'all',
    },
  )

  if (data?.getSignedUrlForAllFilesId && !loading) {
    return (
      <>
        {data.getSignedUrlForAllFilesId.map((file, index) => {
          return (
            <Box key={`file-${index}`} marginBottom={10}>
              {isImage(file.key) && (
                <img
                  key={`printable-image-${index}`}
                  src={file.url}
                  loading="lazy"
                />
              )}

              {getFileType(file.key) === 'pdf' && (
                <PdfViewer file={file.url} showAllPages={true} />
              )}
            </Box>
          )
        })}
      </>
    )
  }
  if (loading) {
    return (
      <Box padding={5} marginTop={10}>
        <SkeletonLoader repeat={2} space={2} height={400} width={800} />
      </Box>
    )
  }
  return (
    <div>
      Ekki tókst að hlaða upp prófaðu að{' '}
      <Button
        variant="text"
        size="large"
        onClick={() => {
          window.location.reload()
        }}
      >
        endurhlaða síðunni
      </Button>
    </div>
  )
}

export default PrintableFiles
