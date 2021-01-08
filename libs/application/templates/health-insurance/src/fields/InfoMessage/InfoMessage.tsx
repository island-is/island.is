import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './InfoMessage.treat'
import { m } from '../../forms/messages'

const InfoMessage: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.MarginFix}>
      <AlertMessage
        type="info"
        title={formatText(
          m.childrenInfoMessageTitle,
          application,
          formatMessage,
        )}
        message={formatText(
          m.childrenInfoMessageText,
          application,
          formatMessage,
        )}
      />
    </Box>
  )
}

export default InfoMessage
