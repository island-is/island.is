import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { carRecyclingMessages } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { States } from '../../../shared/constants'
import { getApplicationAnswers } from '../../../lib/carRecyclingUtils'
import isNumber from 'lodash/isNumber'

export const Vehicles = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
    application.answers,
  )

  const { state } = application

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('vehicles')}
    >
      {state === `${States.DRAFT}` && (
        <Box position="relative" marginBottom={'containerGutter'}>
          <Label>
            {formatMessage(carRecyclingMessages.review.carsSectionTitle)}
          </Label>
        </Box>
      )}

      {selectedVehicles.map((vehicle) => {
        return (
          <Box
            key={vehicle.permno + '-selected'}
            position="relative"
            border="standard"
            borderRadius="large"
            padding={4}
            marginBottom={2}
            display="flex"
            flexDirection={['row']}
            justifyContent={'spaceBetween'}
          >
            <Box>
              <Label>{formatMessage(vehicle.permno || '')}</Label>
              {vehicle.make}, {vehicle.color || vehicle.colorName}
            </Box>

            {vehicle.mileage && isNumber(+vehicle.mileage) && (
              <Box>
                <Label>
                  {formatMessage(carRecyclingMessages.review.mileage)}
                </Label>
                {vehicle.mileage} km
              </Box>
            )}
          </Box>
        )
      })}

      {canceledVehicles.map((vehicle) => {
        return (
          <Box key={vehicle.permno + '-canceled-box'} paddingBottom={'gutter'}>
            <ActionCard
              backgroundColor="red"
              headingVariant="h4"
              key={vehicle.permno + '-canceled'}
              heading={vehicle.permno || ''}
              text={`${vehicle.make}, ${vehicle.color || vehicle.colorName}`}
              tag={{
                label: formatMessage(carRecyclingMessages.review.canceled),
                variant: 'red',
                outlined: false,
              }}
            />
          </Box>
        )
      })}
    </ReviewGroup>
  )
}
