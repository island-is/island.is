import { ActionCard, Box, Stack } from '@island.is/island-ui/core'
import { homeMessages, statusMsgs } from '../lib/messages'
import { prettyName } from '@island.is/regulations'
import { useLocale } from '@island.is/localization'
import { getEditUrl } from '../utils/routing'
import { useNavigate } from 'react-router-dom'
import { ShippedSummary } from '@island.is/regulations/admin'
import { StepNames } from '../types'

export type ShippedRegulationsProps = {
  shippedRegs: ShippedSummary[]
}

export const ShippedRegulations = (props: ShippedRegulationsProps) => {
  const { shippedRegs } = props
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage
  const navigate = useNavigate()

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
                  : 'Dagsetning ekki skilgreind')
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
                        navigate(getEditUrl(shipped.id, StepNames.publish))
                      },
                    }
                  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (undefined as any)
              }
            ></ActionCard>
          )
        })}
      </Stack>
    </Box>
  )
}
