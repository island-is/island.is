import { Box, Stack, Text } from '@island.is/island-ui/core'

import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { europeanHealthInsuranceCardApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const CompletedScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  console.log(application)
  return (
    <Stack space={1}>
      <Box marginBottom={2} marginTop={2}>
        <Text lineHeight="lg">TODO: Hér koma PDF tenglar</Text>
      </Box>
    </Stack>
  )
}
export default CompletedScreen
