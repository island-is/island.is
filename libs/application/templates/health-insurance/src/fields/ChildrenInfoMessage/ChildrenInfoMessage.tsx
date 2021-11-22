import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './ChildrenInfoMessage.css'
import { m } from '../../forms/messages'

const ChildrenInfoMessage: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box className={styles.marginFix}>
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

export default ChildrenInfoMessage
