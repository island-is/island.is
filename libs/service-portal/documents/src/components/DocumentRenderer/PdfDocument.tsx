import { useRef, useState, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Button, PdfViewer, Text } from '@island.is/island-ui/core'
import { Modal, m } from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'
import { ActiveDocumentType } from '../../lib/types'
import { downloadFile } from '../../utils/downloadDocument'
import { messages } from '../../utils/messages'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from './DocumentRenderer.css'

type PdfDocumentProps = {
  document: ActiveDocumentType
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
  const userInfo = useUserInfo()
  const ref = useRef<HTMLDivElement>(null)
  const { formatMessage } = useLocale()

  useEffect(() => {
    if (scalePDF > 1) {
      ref.current?.scrollBy(35, 0)
    }

    // Size of PDF Canvas
  }, [ref.current?.querySelectorAll('canvas')?.[0]?.width])

  return (
    <>
      <Box
        className={styles.pdfControls}
        // justifyContent={'spaceBetween'}
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
            onClick={() => setScalePDF(scalePDF - 0.1)}
            disabled={0.6 > scalePDF}
          />
          <Box
            paddingX={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text variant="small">
              {((scalePDF / initScale) * 100).toFixed(0) + '%'}
            </Text>
          </Box>
          <Button
            circle
            icon="add"
            variant="ghost"
            size="small"
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
            onClick={() => expandCallback(true)}
          />
        ) : onClose ? (
          <Button
            circle
            icon="close"
            variant="ghost"
            size="small"
            onClick={onClose}
          />
        ) : undefined}
      </Box>
      <Box
        className={styles.pdfPage}
        height="full"
        overflow="auto"
        boxShadow="subtle"
        ref={ref}
      >
        <PdfViewer
          file={`data:application/pdf;base64,${document.document.content}`}
          scale={scalePDF}
          autoWidth={false}
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
                  onClick={() => downloadFile(document, userInfo)}
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
  return (
    <>
      <PdfDocument expandCallback={(v) => setModalIsOpen(v)} {...props} />
      <Modal
        onCloseModal={() => setModalIsOpen(false)}
        isVisible={modalIsOpen}
        initialVisibility={false}
        id="pdf-doc-modal"
      >
        {modalIsOpen ? (
          <PdfDocument
            initScale={1.3}
            onClose={() => setModalIsOpen(false)}
            {...props}
          />
        ) : undefined}
      </Modal>
    </>
  )
}
