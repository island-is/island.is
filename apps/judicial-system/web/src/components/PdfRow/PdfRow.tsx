import React, { ReactNode } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import * as styles from './PdfRow.css'

interface Props {
  children?: ReactNode
  caseId: string
  title: string
  pdfType:
    | 'ruling'
    | 'courtRecord'
    | 'request'
    | 'custodyNotice'
    | 'ruling/limitedAccess'
    | 'courtRecord/limitedAccess'
    | 'request/limitedAccess'
}

const PdfRow: React.FC<Props> = ({ children, caseId, title, pdfType }) => {
  return (
    <Box
      data-testid={`${pdfType}PDFButton`}
      className={styles.pdfRow}
      onClick={() =>
        window.open(`${api.apiUrl}/api/case/${caseId}/${pdfType}`, '_blank')
      }
    >
      <Text color="blue400" variant="h4">
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default PdfRow
