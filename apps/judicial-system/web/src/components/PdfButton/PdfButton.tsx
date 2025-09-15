import { FC, PropsWithChildren, useContext } from 'react'
import cn from 'classnames'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import { UserContext } from '../UserProvider/UserProvider'
import * as styles from './PdfButton.css'

interface Props {
  caseId?: string
  connectedCaseParentId?: string
  title?: string | null
  pdfType?:
    | 'ruling'
    | 'caseFilesRecord'
    | 'courtRecord'
    | 'request'
    | 'custodyNotice'
    | 'indictment'
    | 'subpoena'
    | 'subpoenaServiceCertificate'
    | 'verdictServiceCertificate'
    | 'rulingSentToPrisonAdmin'

  disabled?: boolean
  renderAs?: 'button' | 'row'
  handleClick?: () => void
  elementId?: string | string[]
  queryParameters?: string
}

const PdfButton: FC<PropsWithChildren<Props>> = ({
  caseId,
  // This is used when accessing data belonging to a case which has been merged into another case.
  // For access control purposes, the data must be accessed through the parent case.
  connectedCaseParentId,
  title,
  pdfType,
  disabled,
  renderAs = 'button',
  children,
  handleClick, // Overwrites the default onClick handler
  elementId,
  queryParameters,
}) => {
  const { limitedAccess } = useContext(UserContext)

  const handlePdfClick = async () => {
    const prefix = `${limitedAccess ? 'limitedAccess/' : ''}${
      connectedCaseParentId ? `mergedCase/${caseId}/` : ''
    }`
    const postfix = elementId
      ? `/${Array.isArray(elementId) ? elementId.join('/') : elementId}`
      : ''
    const query = queryParameters ? `?${queryParameters}` : ''
    const url = `${api.apiUrl}/api/case/${
      connectedCaseParentId ?? caseId
    }/${prefix}${pdfType}${postfix}${query}`

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
      <span
        className={cn(styles.fileNameContainer, {
          [styles.fileNameContainerWithChildren]: !!children,
        })}
      >
        <Text color="blue400" variant="h4">
          {title}
        </Text>
      </span>
      {children}
    </Box>
  )
}

export default PdfButton
