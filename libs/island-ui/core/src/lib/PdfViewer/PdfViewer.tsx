import React, { FC, useState } from 'react'
// import MyPDF from 'pdf-viewer-reactjs'
import { Box } from '../Box/Box'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import * as styles from './PdfViewer.css'
import { Pagination } from '../Pagination/Pagination'
import { LoadingDots } from '../LoadingDots/LoadingDots'

export interface PdfViewerProps {
  file: string
}

interface PdfProps {
  numPages: number
}

export const PdfViewer: FC<PdfViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: PdfProps) {
    setNumPages(numPages)
  }

  return (
    <>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={styles.pdfViewer}
        loading={
          <Box height="full" display="flex" justifyContent="center">
            <LoadingDots large />
          </Box>
        }
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <Box marginTop={2} marginBottom={4}>
        <Pagination
          page={pageNumber}
          renderLink={(page, className, children) => (
            <Box
              cursor="pointer"
              className={className}
              onClick={() => setPageNumber(page)}
            >
              {children}
            </Box>
          )}
          totalPages={numPages}
        />
      </Box>
    </>
  )
}
