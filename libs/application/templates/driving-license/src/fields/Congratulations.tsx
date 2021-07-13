import React from 'react'

import {
  Box,
  Text,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
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

interface name {
  fullName: string
}

function Congratulations({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  const name = application.externalData.nationalRegistry?.data as name
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={2}>
      <Box marginTop={2}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={`${formatText(
              m.congratulationsTitle,
              application,
              formatMessage,
            )} ${name.fullName}`}
            message={formatText(
              m.congratulationsTitleSuccess,
              application,
              formatMessage,
            )}
          />
        </ContentBlock>

        <Box marginTop={6}>
          <Text>
            {formatText(
              m.paymentSuccessExtraDocuments,
              application,
              formatMessage,
            )}
          </Text>
          <Text marginTop={4}>
            {formatText(
              m.paymentSuccessIfNotReadyFewWeeks,
              application,
              formatMessage,
            )}
          </Text>
        </Box>

        <Box marginTop={6}>
          <img role="presentation" src="/assets/images/movingTruck.svg" />
        </Box>
      </Box>
    </Box>
  )
}

export default Congratulations
