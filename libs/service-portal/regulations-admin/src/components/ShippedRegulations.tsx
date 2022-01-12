import React from 'react'

import { Box, Stack, Text, TopicCard } from '@island.is/island-ui/core'
import { homeMessages, statusMsgs } from '../messages'
import { prettyName } from '@island.is/regulations'
import { useLocale } from '../utils'
import { useShippedRegulationsQuery } from '../utils/dataHooks'

export const ShippedRegulations = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage
  const shippedRegs = useShippedRegulationsQuery()

  if (shippedRegs.loading || shippedRegs.error) {
    return null
  }
  if (shippedRegs.data.length === 0) {
    return null
  }

  return (
    <Box marginTop={[4, 4, 8]}>
      <Text variant="h3" as="h2" marginBottom={[2, 2, 3]}>
        {formatMessage(homeMessages.shippedTitle)}
      </Text>
      <Stack space={2}>
        {shippedRegs.data.map((shipped) => {
          const name = shipped.name
          const publishedDate = shipped.idealPublishDate

          const tagText =
            shipped.draftingStatus === 'published'
              ? t(statusMsgs.published) +
                ' ' +
                (publishedDate ? formatDateFns(publishedDate) : '??dags??')
              : t(statusMsgs.shipped)

          return (
            <TopicCard key={shipped.id} tag={tagText} onClick={() => undefined}>
              {name && prettyName(name)} {shipped.title}
            </TopicCard>
          )
        })}
      </Stack>
    </Box>
  )
}
