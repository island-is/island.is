import React, { FC } from 'react'
import { Stack } from '@island.is/island-ui/core'
import { Car, RecycleActionTypes } from '@island.is/skilavottord-web/types'
import { ActionCard } from '../ActionCard/ActionCard'

interface Props {
  cars: Car[]
  actionType: RecycleActionTypes
  onContinue: (permno: string, actionType: RecycleActionTypes) => void
}

export const ActionCardContainer: FC<Props> = ({
  cars,
  actionType,
  onContinue,
}) => {
  return (
    <Stack space={2}>
      {cars.map((car: Car) => (
        <ActionCard
          key={car.permno}
          car={car}
          onContinue={() => onContinue(car.permno, actionType)}
        />
      ))}
    </Stack>
  )
}
