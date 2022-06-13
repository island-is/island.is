import React from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import * as styles from './PdfRow.css'

interface Props {
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
  disabled?: boolean
  useSigned?: boolean
  renderAs?: 'button' | 'row'
}

const PdfButton: React.FC<Props> = ({
  caseId,
  title,
  pdfType,
  disabled,
  useSigned = true,
  renderAs = 'button',
  children,
}) => {
  const handleClick = () => {
    window.open(
      `${api.apiUrl}/api/case/${caseId}/${pdfType}?useSigned=${useSigned}`,
      '_blank',
    )
  }

  return renderAs === 'button' ? (
    <Button
      data-testid={`${pdfType}PDFButton`}
      variant="ghost"
      size="small"
      icon="open"
      iconType="outline"
      disabled={disabled}
      onClick={handleClick}
    >
      {title}
    </Button>
  ) : (
    <Box
      data-testid={`${pdfType}PDFButton`}
      className={styles.pdfRow}
      onClick={handleClick}
    >
      <Text color="blue400" variant="h4">
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default PdfButton
