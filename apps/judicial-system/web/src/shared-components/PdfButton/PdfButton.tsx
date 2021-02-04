import { Button } from '@island.is/island-ui/core'
import React from 'react'
import { api } from '@island.is/judicial-system-web/src/services'
import * as styles from './PdfButton.treat'
interface Props {
  caseId: string
  title: string
  pdfType: 'ruling' | 'request'
}

const PdfButton: React.FC<Props> = ({ caseId, title, pdfType }) => {
  return (
    <a
      className={styles.pdfLink}
      href={`${api.apiUrl}/api/case/${caseId}/${pdfType}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button variant="ghost" size="small" icon="open" iconType="outline">
        {title}
      </Button>
    </a>
  )
}

export default PdfButton
