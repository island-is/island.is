import { FC } from 'react'
import { ActionCard, Stack } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'

export const ListsInOverview: FC<FieldBaseProps> = ({ application }) => {
  const { answers } = application

  return (
    <Stack space={3}>
      {(answers.constituency as string[]).map((c: string, index: number) => (
        <ActionCard
          key={index}
          heading={'Flokkur 1 - ' + c}
          progressMeter={{
            currentProgress: 0,
            maxProgress: 350,
            withLabel: true,
          }}
        />
      ))}
    </Stack>
  )
}

export default ListsInOverview
