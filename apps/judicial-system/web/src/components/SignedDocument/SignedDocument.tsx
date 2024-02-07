import React from 'react'
import { useIntl } from 'react-intl'

import { Icon, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { signedDocument } from '@island.is/judicial-system-web/messages'

import * as styles from './SignedDocument.css'

interface Props {
  signatory?: string | null
  signingDate?: string | null
}

const SignedDocument = (props: Props) => {
  const { formatMessage } = useIntl()
  const { signatory, signingDate } = props

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <Text>
          {formatMessage(signedDocument, {
            date: formatDate(signingDate, 'dd.MM.yyyy'),
            time: formatDate(signingDate, 'HH:mm'),
          })}
        </Text>
        <Text variant="small">{signatory}</Text>
      </div>
      <Icon icon="checkmark" size="large" color="mint600"></Icon>
    </div>
  )
}

export default SignedDocument
