import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Text, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

const AgentComment: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const agentComments = getValueViaPath(
    application.answers,
    'agentComments',
  ) as string
  const { formatMessage } = useLocale()

  return (
    <Stack space={1}>
      <Text variant="h4">
        {formatText(m.agentCommentsTitle, application, formatMessage)}
      </Text>
      <Text>
        {agentComments
          ? agentComments
          : formatText(m.agentCommentsEmpty, application, formatMessage)}
      </Text>
    </Stack>
  )
}

export default AgentComment
