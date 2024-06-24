import { FC } from 'react'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export const ListsInOverview: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={3}>
      <ActionCard
        heading={'Flokkur 1 - Norðvesturkjördæmi'}
        text={formatMessage(m.listCardText)}
        progressMeter={{
          currentProgress: 0,
          maxProgress: 350,
          withLabel: true,
        }}
      />
    </Stack>
  )
}

export default ListsInOverview
