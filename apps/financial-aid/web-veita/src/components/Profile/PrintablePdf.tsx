import React, { useEffect, useState } from 'react'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { gql, useQuery } from '@apollo/client'
import type { Document, Page, Outline, pdfjs } from 'react-pdf'
import { Box, PdfViewer } from '@island.is/island-ui/core'

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

const PrintablePdf = ({ pdfFiles }: Props) => {
  const allIPdfs: string[] = []
  const [pdfLib, setPdfLib] = useState<IPdfLib>()
  const [pageNumber, setPageNumber] = useState(1)

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

  return (
    <>
      {allIPdfs.map((file, index) => {
        return (
          <Box key={`file-${index}`} marginBottom={10}>
            <iframe
              id="iframepdf"
              src={file}
              className="test"
              allowFullScreen
              frameBorder="0"
            ></iframe>
            <PdfViewer file={file} />
            {/* <pdfLib.Document
              file={{
                url: file,
                httpHeaders: {
                  authorization:
                    'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI1RTNFQjIzRkQ0NDAxQUJCQ0VDNTNEQjBCMEE4OTlFQkNCRjVDNzJSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IkplUHJJXzFFQWF1ODdGUGJDd3FKbnJ5X1hISSJ9.eyJuYmYiOjE2NDczNTMwMjgsImV4cCI6MTY0NzM1NjYyOCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1zZXJ2ZXIuZGV2MDEuZGV2bGFuZC5pcyIsImF1ZCI6WyJAc2tyYS5pcy9pbmRpdmlkdWFscyIsIkBzYW1iYW5kLmlzIl0sImNsaWVudF9pZCI6IkBzYW1iYW5kLmlzL2ZpbmFuY2lhbC1haWQiLCJzdWIiOiJBMjY0M0Y3NDkxRTU3OUVEOTVGOTQ1NUZCMTYxNjQzNDhCRTZCRTIyM0ExQjY2MDgxRDJCRkNGRUEwQTM2NDMxIiwiYXV0aF90aW1lIjoxNjQ3MjY4ODgyLCJpZHAiOiJhdWRrZW5uaV9zaW0iLCJuYW1lIjoiTWFyZ3LDqXQgRmlubmJvZ2Fkw7N0dGlyIiwibmF0aW9uYWxJZCI6IjIzMDU5NTIyNDkiLCJqdGkiOiJCOTQ2QjNFMEI1NjhGOTc5RjM1ODMzRTQwRjVCRDA4QiIsImlhdCI6MTY0NzM1MzAyOCwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBAc2FtYmFuZC5pcy9pbnRlcm5hbCBAc2tyYS5pcy9pbmRpdmlkdWFscyBAc2FtYmFuZC5pcy9maW5hbmNpYWwtYWlkOnJlYWQgQHNhbWJhbmQuaXMvZmluYW5jaWFsLWFpZDp3cml0ZSBvZmZsaW5lX2FjY2VzcyIsImFtciI6WyJleHRlcm5hbCJdfQ.PALRPFZFZDoBhvBZiLlcd30F3oL1LLVo3SnnqfyXLfzpEYz2DufOk_wsYSacRSCEPsZ5GwaC7AE6MW8fF3q3xYrkH9KTGRf74S-xAD0c6cgwleKdp6DNPBi1jPaOWMVuwc-8gtaW-RBcLuYWd6EepCcuASfQiN21DlPE0EwFqXnlWxwxRNBqxZVDeDx0DZKQ7MBTtEmugyolKU2WbMees9D4_Ui-zTxXzcw7CfBK_mWUK--89qs--bItN13hX4euxrQGOZD9gj9jdMbDsmO8OPc40KPH_Exs7oLQ0BDnA5KdKVuQPcE_BA4s_5Wsq9EIxs7B4INGniXQIrxkop7hkA',
                },
                withCredentials: true,
              }}
              file={{ url: file }}
              renderMode="svg"
              className="test"
            >
              <pdfLib.Page pageNumber={pageNumber} />
            </pdfLib.Document> */}
          </Box>
        )
      })}
    </>
  )
}

export default PrintablePdf
