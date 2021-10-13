import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { m } from '../../lib/messages'
import WarningSection from './WarningSection'

export const Declined = ({ application }: FieldBaseProps): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingTop={2}>
        <Text>
          {formatText(m.declinedHelpText, application, formatMessage)}
        </Text>
      </Box>
      <Box marginTop={5} marginBottom={8}>
        <WarningSection
          application={application}
          step={{
            title: m.declinedOtherCountryTitle,
            key: 'key',
            state: false,
            description: m.declinedOtherCountryDescription,
          }}
        />
      </Box>
    </>
  )
}
