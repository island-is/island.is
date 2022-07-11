import React from 'react'
import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Success = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={2}>
      <Box marginTop={2} marginBottom={5}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={`${formatText(m.success, application, formatMessage)} `}
          />
        </ContentBlock>
      </Box>
    </Box>
  )
}
