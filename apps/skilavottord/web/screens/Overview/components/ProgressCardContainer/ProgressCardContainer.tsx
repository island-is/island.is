import React, { FC } from 'react'
import { Stack, Text } from '@island.is/island-ui/core'
import { MockCar, RecycleActionTypes } from '@island.is/skilavottord-web/types'
import { ProgressCard } from '../ProgressCard/ProgressCard'

interface Props {
  title: string
  cars: MockCar[]
  actionType: RecycleActionTypes
  onContinue: (permno: string, actionType: RecycleActionTypes) => void
  status: string // MOCK
}

export const ProgressCardContainer: FC<Props> = ({
  title,
  cars,
  actionType,
  onContinue,
  status,
}) => {
  return (
    <Stack space={2}>
      <Text variant="h3">{title}</Text>
      {cars.map((car: MockCar) => (
        <ProgressCard
          key={car.permno}
          car={{ ...car, status }}
          onClick={() => onContinue(car.permno, actionType)}
        />
      ))}
    </Stack>
  )
}
