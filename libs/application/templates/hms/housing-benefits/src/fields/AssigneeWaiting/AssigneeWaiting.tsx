import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'
import * as m from '../../lib/messages'

export const AssigneeWaiting: React.FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const assignees = application.assignees ?? []
  const signed = (getValueViaPath<string[]>(
    application.answers,
    'householdMemberApprovals',
  ) ?? []) as string[]
  const unsigned = assignees.filter((id) => !signed.includes(id))
  const names = unsigned.map((nationalId) => {
    try {
      const info = formatKennitala.info(nationalId)
      return info.name ?? nationalId
    } catch {
      return nationalId
    }
  })

  const description =
    names.length === 1
      ? formatMessage(m.draftMessages.assigneeWaiting.descriptionSingle, {
          name: names[0],
        })
      : formatMessage(m.draftMessages.assigneeWaiting.description, {
          names: names.join(', '),
        })

  return (
    <Box paddingY={2}>
      <Text variant="h2" marginBottom={2}>
        {formatMessage(m.draftMessages.assigneeWaiting.title)}
      </Text>
      <Text>{description}</Text>
    </Box>
  )
}
