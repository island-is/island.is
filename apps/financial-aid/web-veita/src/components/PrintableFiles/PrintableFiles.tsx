import React from 'react'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { useQuery } from '@apollo/client'
import { Box, Button, PdfViewer } from '@island.is/island-ui/core'
import { GetSignedUrlQuery } from '@island.is/financial-aid-web/veita/graphql'

interface Props {
  files: ApplicationFile[]
  isImages?: boolean
}

const PrintableFiles = ({ files, isImages = false }: Props) => {
  const allIPdfs: string[] = []

  files.map((el) => {
    const { data } = useQuery(GetSignedUrlQuery, {
      variables: { input: { id: el.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    if (data?.getSignedUrlForId) {
      allIPdfs.push(data.getSignedUrlForId.url)
    }
  })

  if (allIPdfs.length === files.length) {
    return (
      <>
        {allIPdfs.map((file, index) => {
          if (file) {
            return (
              <Box key={`file-${index}`} marginBottom={10}>
                {isImages ? (
                  <img
                    key={`printable-image-${index}`}
                    src={file}
                    loading="lazy"
                  />
                ) : (
                  <PdfViewer
                    file={file}
                    renderMode="canvas"
                    showAllPages={true}
                  />
                )}
              </Box>
            )
          }
        })}
      </>
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
