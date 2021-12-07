import React, { FC } from 'react'
import { Stack, Text } from '@island.is/island-ui/core'
import { VehicleInformation } from '@island.is/skilavottord-web/graphql/schema'
import { ProgressCard } from '../ProgressCard/ProgressCard'

interface Props {
  title: string
  cars: VehicleInformation[]
  actionType: any // not good but RecycleActionTypes doesn't exist
  onContinue: (permno: string, actionType: any) => void
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
      {cars.map((car: VehicleInformation) => (
        <ProgressCard
          key={car.permno}
          car={car}
          onClick={() => onContinue(car.permno, actionType)}
        />
      ))}
    </Stack>
  )
}
