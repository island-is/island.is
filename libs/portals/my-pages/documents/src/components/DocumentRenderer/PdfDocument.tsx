import { Box, Button, PdfViewer, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DOMSMAL_DOC_ID, Modal, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useRef, useState } from 'react'
import { ActiveDocumentType2 } from '../../lib/types'
import { usePdfRendererLazyQuery } from '../../queries/PdfRenderer.generated'
import { downloadFile } from '../../utils/downloadDocument'
import { messages } from '../../utils/messages'
import * as styles from './DocumentRenderer.css'

type PdfDocumentProps = {
  document: ActiveDocumentType2
  expandCallback?: (value: boolean) => void
  initScale?: number
  onClose?: () => void
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  document,
  expandCallback,
  initScale = 1.0,
  onClose,
}) => {
  const [scalePDF, setScalePDF] = useState(initScale)
  const ref = useRef<HTMLDivElement>(null)
  const { formatMessage } = useLocale()

  const [pdfRendererQuery] = usePdfRendererLazyQuery()

  useEffect(() => {
    if (scalePDF > 1) {
      ref.current?.scrollBy(35, 0)
    }

    // Size of PDF Canvas
  }, [ref.current?.querySelectorAll('canvas')?.[0]?.width])

  const isCourtCase = document.categoryId === DOMSMAL_DOC_ID

  const formatZoomLevel = (scale: number) =>
    ((scale / initScale) * 100).toFixed(0) + '%'

  return (
    <>
      <Box
        className={styles.pdfControls}
        display="flex"
        flexDirection="row"
        paddingBottom={2}
      >
        <Box className={styles.space} />
        <Box className={styles.pdfAction} display="flex" flexDirection="row">
          <Button
            circle
            icon="remove"
            variant="ghost"
            size="small"
            aria-label={formatMessage(messages.zoomOut, {
              arg: formatZoomLevel(scalePDF - 0.1),
            })}
            onClick={() => setScalePDF(scalePDF - 0.1)}
            disabled={0.6 > scalePDF}
          />
          <Box
            paddingX={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            aria-label={formatMessage(messages.currentZoomLevel)}
          >
            <Text variant="small">{formatZoomLevel(scalePDF)}</Text>
          </Box>
          <Button
            circle
            icon="add"
            variant="ghost"
            size="small"
            aria-label={formatMessage(messages.zoomIn, {
              arg: formatZoomLevel(scalePDF + 0.1),
            })}
            onClick={() => {
              setScalePDF(scalePDF + 0.1)
            }}
            disabled={scalePDF > 3.5}
          />
        </Box>
        {expandCallback ? (
          <Button
            circle
            icon="expand"
            variant="ghost"
            size="small"
            aria-label={formatMessage(messages.openExpandedModal)}
            onClick={() => expandCallback(true)}
          />
        ) : onClose ? (
          <Button
            circle
            icon="close"
            variant="ghost"
            size="small"
            aria-label={formatMessage(messages.closeExpandedModal)}
            onClick={onClose}
          />
        ) : undefined}
      </Box>
      <Box className={styles.pdfPage} height="full" overflow="auto" ref={ref}>
        <PdfViewer
          file={`data:application/pdf;base64,${document.document.value}`}
          scale={scalePDF}
          autoWidth={false}
          onLoadingError={(error) => {
            pdfRendererQuery({
              variables: {
                input: {
                  id: document.id,
                  success: false,
                  error: error.message,
                  isCourtCase: isCourtCase,
                  actions: isCourtCase
                    ? document.actions?.map(
                        (action) => `${action.title}: ${action.data}`,
                      ) ?? []
                    : undefined,
                },
              },
            })
          }}
          onLoadingSuccess={() => {
            pdfRendererQuery({
              variables: {
                input: {
                  id: document.id,
                  success: true,
                  isCourtCase: isCourtCase,
                  actions: isCourtCase
                    ? document.actions?.map(
                        (action) => `${action.title}: ${action.data}`,
                      ) ?? []
                    : undefined,
                },
              },
            })
          }}
          errorComponent={
            <Box>
              <Problem
                message={formatMessage(messages.documentDisplayError, {
                  senderName: document.sender,
                })}
                title={formatMessage(messages.documentErrorLoad)}
                type="no_data"
              />
              <Box
                marginBottom={4}
                alignItems="center"
                justifyContent="center"
                display="flex"
              >
                <Button
                  size="small"
                  onClick={() =>
                    downloadFile({
                      doc: document,
                    })
                  }
                >
                  {formatMessage(m.getDocument)}
                </Button>
              </Box>
            </Box>
          }
        />
      </Box>
    </>
  )
}

export const PdfDocWithModal = (
  props: PdfDocumentProps & { modalCallback?: () => void },
) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { formatMessage } = useLocale()

  return (
    <>
      <PdfDocument expandCallback={(v) => setModalIsOpen(v)} {...props} />
      <Modal
        onCloseModal={() => setModalIsOpen(false)}
        isVisible={modalIsOpen}
        initialVisibility={false}
        label={formatMessage(m.activeDocumentOpenEnlargedAriaLabel, {
          subject: props.document.subject,
        })}
        id="pdf-doc-modal"
        skeleton
      >
        {modalIsOpen ? (
          <>
            <PdfDocument
              initScale={1.3}
              onClose={() => setModalIsOpen(false)}
              {...props}
            />
            <Box className={styles.reveal}>
              <button
                onClick={() => {
                  document
                    .getElementById(`button-${props.document.id}`)
                    ?.focus()
                }}
              >
                {formatMessage(m.backToList)}
              </button>
            </Box>
          </>
        ) : undefined}
      </Modal>
    </>
  )
}
