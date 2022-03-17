import React, { useEffect, useState } from 'react'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { gql, useQuery } from '@apollo/client'
import type { Document, Page, Outline, pdfjs } from 'react-pdf'
import { Box, Button } from '@island.is/island-ui/core'

import * as styles from './Printable.css'
import { loading } from 'libs/island-ui/core/src/lib/Button/Button.css'

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

interface IPdfLib {
  default: any
  pdfjs: typeof pdfjs
  Document: typeof Document
  Page: typeof Page
  Outline: typeof Outline
}
interface PdfProps {
  numPages: number
}

const PrintablePdf = ({ pdfFiles }: Props) => {
  const allIPdfs: string[] = []
  const [pdfLib, setPdfLib] = useState<IPdfLib>()
  const [numPages, setNumPages] = useState(0)

  const onDocumentLoadSuccess = ({ numPages }: PdfProps) => {
    console.log(numPages, 'numpages')
    setNumPages(numPages)
  }

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

  useEffect(() => {
    import('react-pdf')
      .then((pdf) => {
        pdf.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.pdfjs.version}/pdf.worker.min.js`
        setPdfLib(pdf)
      })
      .catch((e) => {})
  }, [])

  useEffect(() => {
    window.onbeforeprint = () => {
      var oHiddFrame = document.getElementById('iframepdf')
      if (oHiddFrame) {
        document.body.appendChild(oHiddFrame)
      }
    }
  }, [])

  if (pdfLib && allIPdfs.length > 0) {
    return (
      <>
        {allIPdfs.map((file, index) => {
          if (file) {
            return (
              <Box key={`file-${index}`} marginBottom={10}>
                <pdfLib.Document
                  file={file}
                  renderMode="canvas"
                  onLoadSuccess={onDocumentLoadSuccess}
                  className={styles.printablePdf}
                >
                  {Array.from(new Array(numPages), (el, index) => {
                    console.log(index + 1, 'pagenumber')
                    return (
                      <pdfLib.Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                      />
                    )
                  })}
                </pdfLib.Document>
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
