import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
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
  const { formatMessage, formatNumber } = useLocale()

  const { selectedVehicles } = getApplicationAnswers(application.answers)

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

      {selectedVehicles.map((vehicle, index) => {
        return (
          <Box
            key={index}
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
              {vehicle.make}, {vehicle.color}
            </Box>
            {vehicle.odometer && isNumber(+vehicle.odometer) && (
              <Box>
                <Label>
                  {formatMessage(carRecyclingMessages.review.odometer)}
                </Label>
                {formatNumber(+vehicle.odometer)} km
              </Box>
            )}
          </Box>
        )
      })}
    </ReviewGroup>
  )
}
