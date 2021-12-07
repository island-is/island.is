import React, { FC } from 'react'
import { Stack } from '@island.is/island-ui/core'
import { VehicleInformation } from '@island.is/skilavottord-web/graphql/schema'
import { ActionCard } from '../ActionCard/ActionCard'

interface Props {
  cars: VehicleInformation[]
  actionType: any // not good but RecycleActionTypes doesn't exist
  onContinue: (permno: string, actionType: any) => void
}

export const ActionCardContainer: FC<Props> = ({
  cars,
  actionType,
  onContinue,
}) => {
  return (
    <Stack space={2}>
      {cars.map((car: VehicleInformation) => (
        <ActionCard
          key={car.permno}
          car={car}
          onContinue={() => onContinue(car.permno, actionType)}
        />
      ))}
    </Stack>
  )
}
