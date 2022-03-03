import React, { FC } from 'react'
import Markdown from 'markdown-to-jsx'

import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage,Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../forms/messages'

const FormerCountryErrorMessage: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={2}>
      <AlertMessage
        type="error"
        title={formatText(m.waitingPeriodTitle, application, formatMessage)}
        message={
          <Markdown>
            {formatText(m.waitingPeriodDescription, application, formatMessage)}
          </Markdown>
        }
      />
    </Box>
  )
}

export default FormerCountryErrorMessage
