import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { carRecyclingMessages } from '../../../lib/messages'
import { ReviewGroupProps } from './props'

export const Cars = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const cars = [
    { name: 'Audi', year: '2006', number: 'BMX45' },
    { name: 'BNW', year: '2008', number: 'BMX46' },
    { name: 'Mercedes', year: '2009', number: 'BMX47' },
  ]

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('fooobar')}
    >
      <Box position="relative" marginBottom={'containerGutter'}>
        <Label>
          {formatMessage(carRecyclingMessages.review.carsSectionTitle)}
        </Label>
      </Box>

      {cars.map((car, index) => {
        return (
          <Box
            key={index}
            position="relative"
            border="standard"
            borderRadius="large"
            padding={4}
            marginBottom={2}
          >
            <Label>{formatMessage(car.number)}</Label>
            {car.name}, {car.year}
          </Box>
        )
      })}
    </ReviewGroup>
  )
}
