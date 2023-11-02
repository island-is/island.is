import { useLocale } from '@island.is/localization'
import * as styles from './DocumentRenderer.css'
import { Box, Button, PdfViewer, Text } from '@island.is/island-ui/core'
import { useState } from 'react'
import { ActiveDocumentType } from '../../lib/types'

type PdfDocumentProps = {
  document: ActiveDocumentType
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ document }) => {
  const [scalePDF, setScalePDF] = useState(1.0)

  return (
    <>
      <Box
        className={styles.pdfControls}
        display="flex"
        flexDirection="row"
        paddingBottom={2}
      >
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
          <Text variant="small">{(scalePDF * 100).toFixed(0) + '%'}</Text>
        </Box>
        <Button
          circle
          icon="add"
          variant="ghost"
          size="small"
          onClick={() => setScalePDF(scalePDF + 0.1)}
          disabled={scalePDF > 3.5}
        />
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
        />
      </Box>
    </>
  )
}
