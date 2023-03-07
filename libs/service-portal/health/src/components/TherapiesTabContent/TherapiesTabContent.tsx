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
  const content = data[0]
  const from = content.periods?.find((x) => x.from !== null)?.from ?? ''
  const to = content.periods?.find((x) => x.to !== null)?.to ?? ''
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
        <UserInfoLine
          label={formatMessage(messages.status)}
          content={content.state?.display}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage(messages.usedTherapySessions)}
          content={content.periods
            ?.find((x) => x.sessions.used)
            ?.sessions.used.toString()}
        />
        <Divider />

        <UserInfoLine
          label={formatMessage(messages.totalTherapySessions)}
          content={content.periods
            ?.find((x) => x.sessions.available)
            ?.sessions.available.toString()}
        />
        <Divider />
      </Stack>
    </Box>
  )
}

export default TherapiesTabContent
