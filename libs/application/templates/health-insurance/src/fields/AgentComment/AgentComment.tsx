import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Text, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

const AgentComment: FC<FieldBaseProps> = ({ application }) => {
  const agentComments = getValueViaPath(
    application.answers,
    'agentComments',
  ) as string
  const { formatMessage } = useLocale()

  return (
    <Stack space={1}>
      <Text variant="h4">Comment from Health Insurance in Iceland</Text>
      <Text>
        {agentComments
          ? agentComments
          : 'Agent did not leave any comments for you'}
      </Text>
    </Stack>
  )
}

export default AgentComment
