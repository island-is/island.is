import type { FC } from 'react'

import { Button } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import { strings } from './ZipButton.strings'
import * as styles from './ZipButton.css'

interface Props {
  caseId: string
  courtCaseNumber?: string | null
  policeCaseNumbers?: string[] | null
}

const ZipButton: FC<Props> = (props) => {
  const { caseId, courtCaseNumber, policeCaseNumbers } = props
  // The court has not assigned a case number yet early in the process
  const caseNumber = courtCaseNumber || policeCaseNumbers?.[0]

  return (
    <a
      href={`${api.apiUrl}/api/case/${caseId}/limitedAccess/allFiles`}
      download={caseNumber ? `mal_${caseNumber}` : 'mal'}
      className={styles.downloadAllButton}
    >
      <Button
        as="span"
        variant="ghost"
        size="small"
        icon="download"
        iconType="outline"
      >
        {strings.getAllDocuments}
      </Button>
    </a>
  )
}

export default ZipButton
