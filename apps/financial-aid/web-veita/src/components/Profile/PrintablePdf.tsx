import React, { useEffect, useState } from 'react'
import { ApplicationFile } from '@island.is/financial-aid/shared/lib'
import { gql, useQuery } from '@apollo/client'
import type { Document, Page, Outline, pdfjs } from 'react-pdf'

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
  console.log(allIPdfs)

  useEffect(() => {
    import('react-pdf')
      .then((pdf) => {
        pdf.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.pdfjs.version}/pdf.worker.min.js`
        setPdfLib(pdf)
      })
      .catch((e) => {})
  }, [])

  if (pdfLib && allIPdfs.length > 0) {
    allIPdfs.map((file) => {
      console.log('ferdu hingad?', pdfLib)
      return (
        <>
          <span>blaa</span>
          <pdfLib.Document
            file={file}
            renderMode="canvas"
            className="test"
          ></pdfLib.Document>
        </>
      )
    })
  }

  return (
    <>
      <span>blaa</span>
    </>
  )
}

export default PrintablePdf
