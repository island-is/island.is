import { Button } from '@island.is/island-ui/core'
import React from 'react'
import { api } from '../../services'
import * as styles from './PdfButton.treat'
interface Props {
  caseId: string
}

const PdfButton: React.FC<Props> = ({ caseId }: Props) => {
  return (
    <a
      className={styles.pdfLink}
      href={`${api.apiUrl}/api/case/${caseId}/ruling`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="ghost" size="small" icon="open" iconType="outline">
        Sjá PDF af þingbók og úrskurði
      </Button>
    </a>
  )
}

export default PdfButton
