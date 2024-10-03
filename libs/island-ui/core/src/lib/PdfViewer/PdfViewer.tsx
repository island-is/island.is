import React, { FC, useState, ReactNode } from 'react'
import { Box } from '../Box/Box'
import { Document, Page, Outline, pdfjs } from 'react-pdf'
import { Pagination } from '../Pagination/Pagination'
import { LoadingDots } from '../LoadingDots/LoadingDots'
import { AlertMessage } from '../AlertMessage/AlertMessage'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import * as styles from './PdfViewer.css'
import cn from 'classnames'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const pdfError = 'Villa kom upp við að birta skjal, reyndu aftur síðar.'

export interface PdfViewerProps {
  file: string
  showAllPages?: boolean
  scale?: number
  autoWidth?: boolean
  errorComponent?: ReactNode
}
interface PdfProps {
  numPages: number
}

interface IPdfLib {
  default: any
  pdfjs: typeof pdfjs
  Document: typeof Document
  Page: typeof Page
  Outline: typeof Outline
}

export const PdfViewer: FC<React.PropsWithChildren<PdfViewerProps>> = ({
  file,
  showAllPages = false,
  scale = 1,
  autoWidth = true,
  errorComponent,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfLibError, setPdfLibError] = useState<any>()

  const onDocumentLoadSuccess = ({ numPages }: PdfProps) => {
    setNumPages(numPages)
  }

  const loadingView = () => {
    return (
      <Box height="full" display="flex" justifyContent="center">
        <LoadingDots large />
      </Box>
    )
  }

  if (pdfLibError) {
    return errorComponent ?? <AlertMessage type="error" title={pdfError} />
  }

  return (
    <>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={cn(styles.pdfViewer, { [styles.pdfSvgPage]: autoWidth })}
        loading={() => loadingView()}
        onError={(error) => setPdfLibError(error)}
        error={errorComponent ?? pdfError}
        externalLinkTarget="_blank"
      >
        {showAllPages ? (
          [...Array(numPages)].map((x, page) => (
            <Page
              key={`page_${page + 1}`}
              pageNumber={page + 1}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              scale={scale}
            />
          ))
        ) : (
          <Page
            renderTextLayer={true}
            renderAnnotationLayer={true}
            pageNumber={pageNumber}
            scale={scale}
          />
        )}
      </Document>

      <Box
        marginTop={2}
        marginBottom={4}
        className={cn({
          [`${styles.displayNone}`]: showAllPages || numPages <= 1,
        })}
      >
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
