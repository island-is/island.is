import { useLocale } from '@island.is/localization'
import * as styles from './DocumentRenderer.css'
import { m, Tooltip } from '@island.is/service-portal/core'
import { Box, Button, PdfViewer, Text } from '@island.is/island-ui/core'
import { useState } from 'react'
import { ActiveDocumentType } from '../../lib/types'
import { messages } from '../../utils/messages'
import { Problem } from '@island.is/react-spa/shared'

type PdfDocumentProps = {
  document: ActiveDocumentType
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ document }) => {
  const [scalePDF, setScalePDF] = useState(1.0)
  const { formatMessage } = useLocale()
  return (
    <>
      <Box
        className={styles.pdfControls}
        display="flex"
        flexDirection="row"
        paddingBottom={2}
      >
        <Tooltip placement="top" as="span" text={formatMessage(m.zoomOut)}>
          <Button
            circle
            icon="remove"
            variant="ghost"
            size="small"
            onClick={() => setScalePDF(scalePDF - 0.1)}
            disabled={0.6 > scalePDF}
          />
        </Tooltip>
        <Box
          paddingX={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="small">{(scalePDF * 100).toFixed(0) + '%'}</Text>
        </Box>
        <Tooltip placement="top" as="span" text={formatMessage(m.zoomIn)}>
          <Button
            circle
            icon="add"
            variant="ghost"
            size="small"
            onClick={() => setScalePDF(scalePDF + 0.1)}
            disabled={scalePDF > 3.5}
          />
        </Tooltip>
      </Box>
      <Box
        className={styles.pdfPage}
        height="full"
        overflow="auto"
        boxShadow="subtle"
      >
        <PdfViewer
          file={`data:application/pdf;base64,${document.document.content}`}
          scale={scalePDF}
          autoWidth={false}
          errorComponent={
            <Problem
              message={formatMessage(messages.documentFetchError, {
                senderName: document.sender,
              })}
              title={formatMessage(messages.documentNotFoundError)}
              type="not_found"
            />
          }
        />
      </Box>
    </>
  )
}
