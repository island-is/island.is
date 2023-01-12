import React from 'react'

import { ActionCard, Box, Stack } from '@island.is/island-ui/core'
import { homeMessages, statusMsgs } from '../messages'
import { prettyName } from '@island.is/regulations'
import { useLocale } from '@island.is/localization'
import { getEditUrl } from '../utils/routing'
import { useHistory } from 'react-router-dom'
import { ShippedSummary } from '@island.is/regulations/admin'

export type ShippedRegulationsProps = {
  shippedRegs: ShippedSummary[]
}

export const ShippedRegulations = (props: ShippedRegulationsProps) => {
  const { shippedRegs } = props
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage
  const history = useHistory()

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
    <Box marginTop={6}>
      <Stack space={2}>
        {shippedRegs.map((shipped) => {
          const name = shipped.name
          const publishedDate = shipped.idealPublishDate

          const tagText =
            shipped.draftingStatus === 'published'
              ? t(statusMsgs.published) +
                ' ' +
                (publishedDate
                  ? formatDateFns(publishedDate, 'd. MMM yyyy')
                  : '??dags??')
              : t(statusMsgs.shipped)

          return (
            <ActionCard
              key={shipped.id}
              date={name ? prettyName(name) : undefined}
              tag={{
                label: tagText,
                variant: 'blueberry',
              }}
              heading={shipped.title}
              cta={
                shipped.draftingStatus === 'shipped'
                  ? {
                      icon: 'arrowForward',
                      label: t(homeMessages.cta_publish),
                      variant: 'text',
                      size: 'small',
                      onClick: () => {
                        history.push(getEditUrl(shipped.id, 'publish'))
                      },
                    }
                  : (undefined as any)
              }
            ></ActionCard>
          )
        })}
      </Stack>
    </Box>
  )
}
