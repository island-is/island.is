import React, { FC, useEffect, useState, ReactNode } from 'react'
import { Box } from '../Box/Box'
import type { Document, Page, Outline, pdfjs } from 'react-pdf'
import { Pagination } from '../Pagination/Pagination'
import { LoadingDots } from '../LoadingDots/LoadingDots'
import { AlertMessage } from '../AlertMessage/AlertMessage'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import * as styles from './PdfViewer.css'
import cn from 'classnames'

const pdfError = 'Villa kom upp við að birta skjal, reyndu aftur síðar.'

export interface PdfViewerProps {
  file: string
  showAllPages?: boolean
  scale?: number
  autoWidth?: boolean
  errorComponent?: ReactNode
  onLoadingError?: (error: Error) => void
  onLoadingSuccess?: () => void
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
  onLoadingError,
  onLoadingSuccess,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfLib, setPdfLib] = useState<IPdfLib>()
  const [pdfLibError, setPdfLibError] = useState<any>()

  useEffect(() => {
    import('react-pdf')
      .then((pdf) => {
        const path = window.location.origin
        const isLocalhost = path.includes('localhost')
        const workerUrl = isLocalhost
          ? 'https://assets.ctfassets.net/8k0h54kbe6bj/8dqL0H07pYWZEkXwLtgBp/1c347f9a4f2bb255f78389b42cf40b97/pdf.worker.min.mjs'
          : `${path}/assets/pdf.worker.min.mjs`
        pdf.pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
        setPdfLib(pdf)
      })
      .catch((e) => {
        setPdfLibError(e)
      })
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: PdfProps) => {
    setNumPages(numPages)
    onLoadingSuccess && onLoadingSuccess()
  }

  const loadingView = () => {
    return (
      <Box height="full" display="flex" justifyContent="center">
        <LoadingDots size="large" />
      </Box>
    )
  }

  if (pdfLibError) {
    return errorComponent ?? <AlertMessage type="error" title={pdfError} />
  }

  if (pdfLib) {
    return (
      <>
        <pdfLib.Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className={cn(styles.pdfViewer, { [styles.pdfSvgPage]: autoWidth })}
          loading={() => loadingView()}
          error={errorComponent ?? pdfError}
          onLoadError={onLoadingError}
          externalLinkTarget="_blank"
        >
          {showAllPages ? (
            [...Array(numPages)].map((x, page) => (
              <pdfLib.Page
                key={`page_${page + 1}`}
                pageNumber={page + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                scale={scale}
              />
            ))
          ) : (
            <pdfLib.Page
              renderTextLayer={true}
              renderAnnotationLayer={true}
              pageNumber={pageNumber}
              scale={scale}
            />
          )}
        </pdfLib.Document>

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

  return loadingView()
}
