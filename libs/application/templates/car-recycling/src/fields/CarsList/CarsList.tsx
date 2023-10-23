import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  ButtonTypes,
  ContentBlock,
  Inline,
  Text,
} from '@island.is/island-ui/core'

import {
  FieldDescription,
  InputController,
} from '@island.is/shared/form-fields'
import { carRecyclingMessages } from '../../lib/messages'
import { formatText } from '@island.is/application/core'
import { Label } from '@island.is/application/ui-components'

const CarsList: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  let cars = [
    { name: 'Audi', year: '2006', number: 'BMX45' },
    { name: 'BMW', year: '2008', number: 'BMX46' },
    { name: 'Mercedes', year: '2009', number: 'BMX47' },
  ]

  let selectedCars: any[] = []

  function recycle(car: { name: string; year: string; number: string }): void {
    selectedCars.push(car)
    cars = cars.filter((item) => item.number !== car.number)

    console.log('RECYCLE', selectedCars)
    console.log('RECYCLE111', cars)
  }

  function cancel(car: { name: string; year: string; number: string }): void {
    cars.push(car)
    selectedCars = selectedCars.filter((item) => item.number !== car.number)

    console.log('CANCEL')
  }

  return (
    <Box>
      <Box paddingTop={2}>
        <InputController
          id="{nameFieldId}"
          backgroundColor="blue"
          label={formatText(
            carRecyclingMessages.cars.filter,
            application,
            formatMessage,
          )}
          onChange={(e) => {
            //setValue(nameFieldId as string, e.target.value)
          }}
        />
      </Box>

      <Box position="relative" marginBottom={3} marginTop={3}>
        <Label>{formatMessage(carRecyclingMessages.cars.selectedTitle)}</Label>
      </Box>
      {selectedCars.map((car, index) => {
        return (
          <Box marginBottom={2}>
            <ActionCard
              key={index}
              tag={{
                label: formatMessage(carRecyclingMessages.cars.coOwner),
                variant: 'red',
                outlined: true,
              }}
              cta={{
                icon: undefined,
                buttonType: {
                  variant: 'primary',
                  colorScheme: 'destructive',
                },
                label: formatMessage(carRecyclingMessages.cars.cancel),
                onClick: () => cancel(car),
              }}
              heading={car.number}
              text={`${car.name}, ${car.year}`}
              unavailable={{
                active: false,
                label: formatMessage(carRecyclingMessages.cars.cantBeRecycled),
              }}
            />
          </Box>
        )
      })}

      <hr />
      <Box position="relative" marginBottom={3} marginTop={2}>
        <Label>{formatMessage(carRecyclingMessages.cars.overview)}</Label>
      </Box>

      {cars.map((car, index) => {
        return (
          <Box marginBottom={2}>
            <ActionCard
              key={index}
              tag={{
                label: formatMessage(carRecyclingMessages.cars.coOwner),
                variant: 'red',
                outlined: true,
              }}
              cta={{
                icon: undefined,
                buttonType: {
                  variant: 'primary',
                  colorScheme: 'default',
                },
                label: formatMessage(carRecyclingMessages.cars.recycle),
                onClick: () => recycle(car),
              }}
              heading={car.number}
              text={`${car.name}, ${car.year}`}
              unavailable={{
                active: false,
                label: formatMessage(carRecyclingMessages.cars.cantBeRecycled),
              }}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default CarsList
