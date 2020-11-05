import React, { FC } from 'react'
import { Stack, Text } from '@island.is/island-ui/core'
import { Car, RecycleActionTypes } from '@island.is/skilavottord-web/types'
import { ProgressCard } from '../ProgressCard/ProgressCard'

interface Props {
  title: string
  cars: Car[]
  actionType: RecycleActionTypes
  onContinue: (permno: string, actionType: RecycleActionTypes) => void
}

export const ProgressCardContainer: FC<Props> = ({
  title,
  cars,
  actionType,
  onContinue,
}) => {
  return (
    <Stack space={2}>
      <Text variant="h3">{title}</Text>
      {cars.map((car: Car) => (
        <ProgressCard
          key={car.permno}
          car={car}
          onClick={() => onContinue(car.permno, actionType)}
        />
      ))}
    </Stack>
  )
}
