import { FC } from 'react'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const areas = [
  'Sunnlendingafjórðungur',
  'Vestfirðingafjórðungur',
  'Norðlendingafjórðungur',
  'Austfirðingafjórðungur',
]

export const ListsInOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  return (
    <Stack space={3}>
      {areas.map((area) => {
        return (
          <ActionCard
            key={area}
            eyebrow={
              formatMessage(m.listDateTil) +
              ': ' +
              (application.answers.collection as any).dateTil
            }
            heading={(application.answers.applicant as any).name + ' - ' + area}
            text={formatMessage(m.listCardText)}
            progressMeter={{
              currentProgress: 0,
              maxProgress: 350,
              withLabel: true,
            }}
          />
        )
      })}
    </Stack>
  )
}

export default ListsInOverview
