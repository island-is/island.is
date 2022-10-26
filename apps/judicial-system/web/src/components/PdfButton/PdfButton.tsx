import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import * as styles from './PdfButton.css'
import { pdfButton as m } from './PdfButton.strings'

interface Props {
  caseId: string
  title: string
  pdfType?:
    | 'ruling'
    | 'caseFiles'
    | 'courtRecord'
    | 'request'
    | 'custodyNotice'
    | 'ruling/limitedAccess'
    | 'courtRecord/limitedAccess'
    | 'request/limitedAccess'
  disabled?: boolean
  useSigned?: boolean
  renderAs?: 'button' | 'row'
  handleClick?: () => void
  policeCaseNumber?: string // Only used if pdfType is caseFiles
}

const PdfButton: React.FC<Props> = ({
  caseId,
  title,
  pdfType,
  disabled,
  useSigned = true,
  renderAs = 'button',
  children,
  // Overwrites the default onClick handler
  handleClick,
  policeCaseNumber,
}) => {
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false)
  const { formatMessage } = useIntl()

  const handlePdfClick = async () => {
    try {
      const newPdfType =
        pdfType === 'caseFiles' ? `${pdfType}/${policeCaseNumber}` : pdfType
      const url = `${api.apiUrl}/api/case/${caseId}/${newPdfType}?useSigned=${useSigned}`

      setIsPdfLoading(true)

      await fetch(url)

      setIsPdfLoading(false)
      window.open(url, '_blank')
    } catch (e) {
      toast.error(formatMessage(m.generatePDFError))
    }
  }

  return renderAs === 'button' ? (
    <Button
      data-testid={`${pdfType || ''}PDFButton`}
      variant="ghost"
      size="small"
      icon="open"
      iconType="outline"
      disabled={disabled}
      loading={isPdfLoading}
      onClick={handleClick ? handleClick : pdfType ? handlePdfClick : undefined}
    >
      {title}
    </Button>
  ) : (
    <Box
      data-testid={`${pdfType || ''}PDFButton`}
      className={styles.pdfRow}
      onClick={handleClick ? handleClick : pdfType ? handlePdfClick : undefined}
    >
      <Text color="blue400" variant="h4">
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default PdfButton
