import React from 'react'
import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { m } from '../lib/messages'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Congratulations = ({ application }: PropTypes): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={2}>
      <Box marginTop={2}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={`${formatText(
              m.finalAssessmentTitle,
              application,
              formatMessage,
            )}`}
            message={`${formatText(
              m.finalAssessmentDescription,
              application,
              formatMessage,
            )}`}
          />
        </ContentBlock>
      </Box>
    </Box>
  )
}
