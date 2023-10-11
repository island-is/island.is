import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import WarningSection from './WarningSection'

export const Declined = ({ application }: FieldBaseProps): JSX.Element => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box paddingTop={2}>
        <Text>
          {formatText(
            m.declinedOtherCountryHelpText,
            application,
            formatMessage,
          )}
        </Text>
      </Box>
      <Box marginTop={5} marginBottom={8}>
        <WarningSection
          application={application}
          step={{
            title: m.declinedOtherEESCountryTitle,
            key: 'key',
            state: false,
            description: m.declinedOtherEESCountryDescription,
          }}
        />
        <WarningSection
          application={application}
          step={{
            title: m.declinedOtherNonEESCountryTitle,
            key: 'key',
            state: false,
            description: m.declinedOtherNonEESCountryDescription,
          }}
        />
      </Box>
    </>
  )
}
