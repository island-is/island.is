import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Button } from '@island.is/island-ui/core'

import { api } from '../../services'
import { strings } from './ZipButton.strings'
import * as styles from './ZipButton.css'

interface Props {
  caseId: string
  courtCaseNumber?: string | null
}

const ZipButton: FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { caseId, courtCaseNumber } = props

  return (
    <a
      href={`${api.apiUrl}/api/case/${caseId}/limitedAccess/allFiles`}
      download={`mal_${courtCaseNumber}`}
      className={styles.downloadAllButton}
    >
      <Button variant="ghost" size="small" icon="download" iconType="outline">
        {formatMessage(strings.getAllDocuments)}
      </Button>
    </a>
  )
}

export default ZipButton
