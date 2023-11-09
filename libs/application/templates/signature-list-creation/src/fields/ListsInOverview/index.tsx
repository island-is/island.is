import { FC } from 'react'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'

const areas = [
  'Sunnlendingafjórðungur',
  'Vestfirðingafjórðungur',
  'Norðlendingafjórðungur',
  'Austfirðingafjórðungur',
]

export const ListsInOverview: FC<FieldBaseProps> = ({ application }) => {
  return (
    <Stack space={3}>
      {areas.map((area) => {
        return (
          <ActionCard
            eyebrow={
              'Lokadadur: ' + (application.answers.collection as any).dateTil
            }
            heading={(application.answers.applicant as any).name + ' - ' + area}
            text="Forsetakosningar 2024"
            progressMeter={{
              currentProgress: 45,
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
