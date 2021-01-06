import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

const InfoMessage: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <AlertMessage
      type="info"
      title={formatText(m.childrenInfoMessageTitle, application, formatMessage)}
      message={formatText(
        m.childrenInfoMessageText,
        application,
        formatMessage,
      )}
    />
  )
}

export default InfoMessage
