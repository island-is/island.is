import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/core'
import { declined } from '../../lib/messages'
import { WarningSection } from './WarningSection'

export const Declined = ({ application }: FieldBaseProps): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingTop={2}>
        <Text>{formatMessage(declined.labels.helpText)}</Text>
      </Box>
      <Box marginTop={5} marginBottom={8}>
        <WarningSection
          application={application}
          step={{
            title: formatMessage(declined.labels.otherCountryTitle),
            description: formatMessage(declined.labels.otherCountryDescription),
          }}
        />
      </Box>
    </>
  )
}
