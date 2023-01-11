import { Box, Stack, Text } from '@island.is/island-ui/core'

import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { europeanHealthInsuranceCardApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const IntroScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  return (

    <Stack space={1}>
      <Box marginBottom={2} marginTop={2}>
        <Text lineHeight="lg">
          {formatText(
            m.introScreen.sectionDescription,
            application,
            formatMessage,
          )}
        </Text>
      </Box>
    </Stack>



  )
}
export default IntroScreen
