import React, { FC } from 'react'
import { Stack } from '@island.is/island-ui/core'
import { VehicleInformation } from '@island.is/skilavottord-web/graphql/schema'

import { RecycleActionTypes } from '../../types'
import { ActionCard } from '../ActionCard/ActionCard'

interface Props {
  cars: VehicleInformation[]
  actionType: RecycleActionTypes
  onContinue: (permno: string, actionType: RecycleActionTypes) => void
}

export const ActionCardContainer: FC<React.PropsWithChildren<Props>> = ({
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
