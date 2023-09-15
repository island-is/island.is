import React from 'react'
import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import DigitalService from '../../assets/DigitalServices'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Congratulations = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={formatText(
              m.applicationCompleteAlertTitle,
              application,
              formatMessage,
            )}
            message={formatText(
              m.applicationCompleteAlertDescription,
              application,
              formatMessage,
            )}
          />
        </ContentBlock>
      </Box>
      <Box display="flex" justifyContent="center" width="full">
        <DigitalService />
      </Box>
    </Box>
  )
}
