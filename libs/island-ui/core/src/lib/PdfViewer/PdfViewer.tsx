import React, { FC, useEffect, useRef, useState, ReactNode } from 'react'
import { Box } from '../Box/Box'
import type { Document, DocumentProps, Page, Outline, pdfjs } from 'react-pdf'
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
  /**
   * With showAllPages, only draw the pages that are near the viewport. The
   * other pages keep their size and text layer but release their canvas, so
   * memory stays flat no matter how many pages the document has.
   */
  lazyPages?: boolean
  scale?: number
  autoWidth?: boolean
  errorComponent?: ReactNode
  disableLoading?: boolean
  onLoadingError?: (error: Error) => void
  onLoadingSuccess?: () => void
}

type PdfDocument = Parameters<NonNullable<DocumentProps['onLoadSuccess']>>[0]

interface PageSize {
  width: number
  height: number
}

interface IPdfLib {
  default: any
  pdfjs: typeof pdfjs
  Document: typeof Document
  Page: typeof Page
  Outline: typeof Outline
}

interface LazyPageProps {
  Page: typeof Page
  pageNumber: number
  scale: number
  size: PageSize
}

const LazyPage = ({ Page, pageNumber, scale, size }: LazyPageProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true)
      return
    }

    // Draw pages within one screen height above or below the viewport
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: '100% 0px' },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={styles.lazyPage}
      style={
        {
          '--pdf-page-width': `${Math.floor(size.width * scale)}px`,
          '--pdf-page-height': `${Math.floor(size.height * scale)}px`,
        } as React.CSSProperties
      }
    >
      <Page
        pageNumber={pageNumber}
        renderMode={isNearViewport ? 'canvas' : 'none'}
        renderTextLayer={true}
        renderAnnotationLayer={true}
        scale={scale}
      />
    </div>
  )
}

export const PdfViewer: FC<React.PropsWithChildren<PdfViewerProps>> = ({
  file,
  showAllPages = false,
  lazyPages = false,
  scale = 1,
  autoWidth = true,
  errorComponent,
  disableLoading = false,
  onLoadingError,
  onLoadingSuccess,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfLib, setPdfLib] = useState<IPdfLib>()
  const [pdfLibError, setPdfLibError] = useState<any>()
  const [pdfDocument, setPdfDocument] = useState<PdfDocument>()
  const [pageSizes, setPageSizes] = useState<PageSize[]>()
  const [pageSizesFailed, setPageSizesFailed] = useState(false)

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

  // Lazy pages need every page's size up front so the document has its full
  // height before any page is drawn
  useEffect(() => {
    if (!lazyPages || !showAllPages || !pdfDocument) return

    let cancelled = false

    Promise.all(
      Array.from({ length: pdfDocument.numPages }, (_, index) =>
        pdfDocument.getPage(index + 1).then((page) => {
          const { width, height } = page.getViewport({ scale: 1 })
          return { width, height }
        }),
      ),
    )
      .then((sizes) => {
        if (!cancelled) setPageSizes(sizes)
      })
      .catch(() => {
        if (!cancelled) setPageSizesFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [lazyPages, showAllPages, pdfDocument])

  const onDocumentLoadSuccess = (pdf: PdfDocument) => {
    setNumPages(pdf.numPages)
    setPdfDocument(pdf)
    setPageSizes(undefined)
    setPageSizesFailed(false)
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
    const renderAllPages = () => {
      // Fall back to drawing every page if the page sizes couldn't be read
      if (lazyPages && !pageSizesFailed) {
        return pageSizes?.map((size, page) => (
          <LazyPage
            key={`page_${page + 1}`}
            Page={pdfLib.Page}
            pageNumber={page + 1}
            scale={scale}
            size={size}
          />
        ))
      }

      return [...Array(numPages)].map((x, page) => (
        <pdfLib.Page
          key={`page_${page + 1}`}
          pageNumber={page + 1}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          scale={scale}
        />
      ))
    }

    return (
      <>
        <pdfLib.Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className={cn(styles.pdfViewer, { [styles.pdfSvgPage]: autoWidth })}
          loading={disableLoading ? undefined : () => loadingView()}
          error={errorComponent ?? pdfError}
          onLoadError={onLoadingError}
          externalLinkTarget="_blank"
        >
          {showAllPages ? (
            renderAllPages()
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
