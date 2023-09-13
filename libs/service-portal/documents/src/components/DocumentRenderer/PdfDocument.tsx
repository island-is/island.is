import { useLocale } from '@island.is/localization'
import * as styles from './DocumentRenderer.css'
import { m } from '@island.is/service-portal/core'
import {
  Box,
  Tooltip,
  Button,
  PdfViewer,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { downloadFile } from '../../utils/downloadDocument'
import { useUserInfo } from '@island.is/auth/react'
import { ActiveDocumentType } from '../../screens/Overview/NewOverview'
type PdfDocumentProps = {
  document: ActiveDocumentType
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ document }) => {
  const { formatMessage } = useLocale()
  const [scalePDF, setScalePDF] = useState(1.0)

  const userInfo = useUserInfo()

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
            onClick={() => setScalePDF(0.6 > scalePDF ? 0.5 : scalePDF - 0.1)}
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
            onClick={() => setScalePDF(scalePDF > 3.9 ? 4 : scalePDF + 0.1)}
          />
        </Tooltip>
        <Box paddingLeft={2}>
          <Tooltip placement="top" as="span" text={formatMessage(m.download)}>
            <Button
              variant="ghost"
              size="small"
              circle
              icon="download"
              onClick={() => downloadFile(document, userInfo)}
            />
          </Tooltip>
        </Box>
        <Box paddingLeft={2}>
          <Tooltip placement="top" as="span" text={formatMessage(m.print)}>
            <Button
              variant="ghost"
              size="small"
              circle
              icon="print"
              onClick={() => downloadFile(document, userInfo)}
            />
          </Tooltip>
        </Box>
      </Box>
      <Box
        className={styles.pdfPage}
        height="full"
        overflow="auto"
        boxShadow="subtle"
      >
        <PdfViewer
          file={`data:application/pdf;base64,${document.document.content}`}
          showAllPages
          scale={scalePDF}
          autoWidth={false}
        />
      </Box>
    </>
  )
}
