import React from 'react'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { gql, useQuery } from '@apollo/client'
import { Box, Button, PdfViewer } from '@island.is/island-ui/core'

interface Props {
  pdfFiles: ApplicationFile[]
}

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlForIdInput!) {
    getSignedUrlForId(input: $input) {
      url
      key
    }
  }
`

const PrintablePdf = ({ pdfFiles }: Props) => {
  const allIPdfs: string[] = []

  pdfFiles.map((el) => {
    const { data } = useQuery(GetSignedUrlQuery, {
      variables: { input: { id: el.id } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
    if (data?.getSignedUrlForId) {
      allIPdfs.push(data.getSignedUrlForId.url)
    }
  })

  if (allIPdfs.length === pdfFiles.length) {
    return (
      <>
        {allIPdfs.map((file, index) => {
          if (file) {
            console.log('hvað ferdu oft hér í gegn?')

            return (
              <Box key={`file-${index}`} marginBottom={10}>
                <PdfViewer
                  file={file}
                  renderMode="canvas"
                  showAllPages={true}
                />
              </Box>
            )
          }
        })}
      </>
    )
  }
  return (
    <div>
      Ekki tókst að hlaða upp pdf prófaðu að{' '}
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

export default PrintablePdf
