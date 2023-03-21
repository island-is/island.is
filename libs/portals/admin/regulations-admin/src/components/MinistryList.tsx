import {
  ActionCard,
  Box,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { ministryMessages as msg } from '../lib/messages'
import { useMinistriesQuery } from '../utils/dataHooks'
import { useLocale } from '@island.is/localization'

export const MinistryList = () => {
  const t = useLocale().formatMessage
  const ministries = useMinistriesQuery()

  if (ministries.loading) {
    return (
      <Box marginBottom={[4, 4, 6]}>
        <SkeletonLoader height={80} repeat={3} space={1} />
      </Box>
    )
  }

  if (ministries.error || ministries.data.length === 0) {
    return null
  }

  return (
    <Box marginBottom={[4, 4, 6]}>
      <Stack space={2}>
        {ministries.data.map((item, i) => {
          const { name, slug } = item
          return (
            <ActionCard
              key={slug + '-' + i}
              heading={name}
              cta={{
                label: t(msg.cta),
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}
