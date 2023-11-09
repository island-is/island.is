import React, { useContext } from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import { UserContext } from '../UserProvider/UserProvider'
import * as styles from './PdfButton.css'

interface Props {
  caseId: string
  title: string
  pdfType?:
    | 'ruling'
    | 'caseFilesRecord'
    | 'courtRecord'
    | 'request'
    | 'custodyNotice'
    | 'indictment'
  disabled?: boolean
  renderAs?: 'button' | 'row'
  handleClick?: () => void
  policeCaseNumber?: string // Only used if pdfType ends with caseFilesRecord
}

const PdfButton: React.FC<React.PropsWithChildren<Props>> = ({
  caseId,
  title,
  pdfType,
  disabled,
  renderAs = 'button',
  children,
  handleClick, // Overwrites the default onClick handler
  policeCaseNumber,
}) => {
  const { limitedAccess } = useContext(UserContext)

  const handlePdfClick = async () => {
    const prefix = limitedAccess ? 'limitedAccess/' : ''
    const postfix = pdfType?.endsWith('caseFilesRecord')
      ? `/${policeCaseNumber}`
      : ''
    const url = `${api.apiUrl}/api/case/${caseId}/${prefix}${pdfType}${postfix}`

    window.open(url, '_blank')
  }

  return renderAs === 'button' ? (
    <Button
      data-testid={`${pdfType || ''}PDFButton`}
      variant="ghost"
      size="small"
      icon="open"
      iconType="outline"
      disabled={disabled}
      onClick={handleClick ? handleClick : pdfType ? handlePdfClick : undefined}
    >
      {title}
    </Button>
  ) : (
    <Box
      data-testid={`${pdfType || ''}PDFButton`}
      className={`${styles.pdfRow} ${
        disabled ? styles.disabled : styles.cursor
      }`}
      onClick={() => {
        if (disabled) {
          return
        }

        if (handleClick) {
          return handleClick()
        }

        if (pdfType) {
          return handlePdfClick()
        }
      }}
    >
      <span className={styles.fileNameContainer}>
        <Text color="blue400" variant="h4">
          {title}
        </Text>
      </span>
      {children}
    </Box>
  )
}

export default PdfButton
