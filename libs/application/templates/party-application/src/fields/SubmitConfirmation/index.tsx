import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { Success } from '../components'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const SubmitConfirmation: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  console.log(answers)
  return (
    <Box marginTop={4}>
      <Text marginBottom={3} variant="h4">
        {answers.constituencies}
      </Text>

      <Success
        title="Meðmælendalista hefur verið skilað"
        subtitle=" Þú munt fá skilaboð í pósthólf inni á mínum síðum Ísland.is með framhaldið."
      />
    </Box>
  )
}

export default SubmitConfirmation
