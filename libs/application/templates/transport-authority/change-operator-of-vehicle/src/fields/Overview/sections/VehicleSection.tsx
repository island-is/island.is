import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../../lib/messages'
import { ReviewGroup } from '@island.is/application/ui-components'
import { formatMileage } from '../../../utils'

export const VehicleSection: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const carColor = getValueViaPath(answers, 'pickVehicle.color', undefined) as
    | string
    | undefined
  const carPlate = getValueViaPath(answers, 'pickVehicle.plate', '') as string
  const mileage = getValueViaPath(answers, 'vehicle.mileage', '') as string

  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.pickVehicle.vehicle)}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text>
            {getValueViaPath(answers, 'pickVehicle.type', '') as string}
          </Text>
          <Text>
            {carColor ? `${carColor} - ` : ''}
            {carPlate}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          {mileage.length > 0 && (
            <Text>
              {`${formatMessage(overview.labels.mileage)} ${formatMileage(
                parseInt(mileage, 10),
              )}`}
            </Text>
          )}
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
