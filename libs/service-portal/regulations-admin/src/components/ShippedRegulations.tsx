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

  // DECIDE:
  // We are currently loading both shipped (i.e. locked) drafts
  // and published regulaions.
  // Published regulations might never appear if they're Garbage-collected
  // instantly.
  //
  // But if not, then showing them here (without an "edit" button)
  // might be nice for UX — as feedback about recent results of your
  // completed tasks.
  //
  // Food for thought.

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
                (publishedDate
                  ? formatDateFns(publishedDate, 'dd. MMM yyyy')
                  : '??dags??')
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
