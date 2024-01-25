import { FC } from 'react'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { SignatureCollection } from '@island.is/api/schema'

export const ListsInOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const currentCollection: SignatureCollection = application.externalData
    .currentCollection?.data as SignatureCollection

  return (
    <Stack space={3}>
      {currentCollection.areas.map((area) => {
        return (
          <ActionCard
            key={area.id}
            eyebrow={
              formatMessage(m.listDateTil) +
              ': ' +
              (application.answers.collection as any).dateTil
            }
            heading={
              (application.answers.applicant as any).name + ' - ' + area.name
            }
            text={currentCollection.name}
            progressMeter={{
              currentProgress: 0,
              maxProgress: area.min,
              withLabel: true,
            }}
          />
        )
      })}
    </Stack>
  )
}

export default ListsInOverview
