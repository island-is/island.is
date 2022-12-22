import { Box, Stack, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { europeanHealthInsuranceCardApplicationMessages as m } from '../../lib/messages'

const IntroScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={4}>
      <Stack space={7}>
        <Stack space={3}>
          <Box>
            <Text variant="h3">
              {formatText(
                m.introScreen.sectionTitle,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {formatText(
                m.introScreen.sectionDescription,
                application,
                formatMessage,
              )}
            </Text>
          </Box>

          {application?.state === 'approved' && <Box marginBottom={8} />}
        </Stack>
      </Stack>
    </Box>
  )
}
export default IntroScreen
