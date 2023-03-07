import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Text, Stack, Divider } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import { formatDate, UserInfoLine } from '@island.is/service-portal/core'
import { Therapies } from '@island.is/api/schema'

interface Props {
  data: Therapies[]
}

export const TherapiesTabContent: FC<Props> = ({ data }) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  console.log(data)
  if (data.length === 0) {
    return (
      <Box width="full" marginTop={4} display="flex" justifyContent="center">
        <Text variant="h5" as="h3">
          {formatMessage(messages.noData)}
        </Text>
      </Box>
    )
  }

  if (!data || data.length === 0) return <Box />
  const from = data[0].periods?.find((x) => x.from !== null)?.from ?? ''
  const to = data[0].periods?.find((x) => x.to !== null)?.to ?? ''
  const timePeriod = [formatDate(from), formatDate(to)]
    .filter(Boolean)
    .join(' - ')
  return (
    <Box width="full" marginTop={4}>
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(messages.informationAboutStatus)}
          label={formatMessage(messages.timePeriod)}
          content={timePeriod}
        />
        <Divider />
        <UserInfoLine label={formatMessage(messages.status)} />
        <Divider />

        <UserInfoLine label={formatMessage(messages.usedTherapySessions)} />
        <Divider />

        <UserInfoLine label={formatMessage(messages.totalTherapySessions)} />
        <Divider />
      </Stack>
    </Box>
  )
}

export default TherapiesTabContent
