import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import {
  CoOwnerAndOperator,
  ReviewScreenProps,
  UserInformation,
} from '../../../shared'
import { formatIsk, formatMileage } from '../../../utils'

export const VehicleSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const dateOfContract = format(
    parseISO(getValueViaPath<string>(answers, 'vehicle.date') ?? ''),
    'dd.MM.yyyy',
    {
      locale: is,
    },
  )
  const carColor = getValueViaPath<string>(answers, 'pickVehicle.color')
  const carPlate = getValueViaPath<string>(answers, 'pickVehicle.plate') ?? ''
  const salePrice = getValueViaPath<string>(answers, 'vehicle.salePrice') ?? ''
  const mileage = getValueViaPath<string>(answers, 'vehicleMileage.value') ?? ''
  const buyerCoOwnerAndOperator =
    getValueViaPath<CoOwnerAndOperator[]>(answers, 'buyerCoOwnerAndOperator') ??
    []
  const sellerCoOwner =
    getValueViaPath<UserInformation[]>(answers, 'sellerCoOwner') ?? []
  const isSeller =
    (getValueViaPath<string>(answers, 'seller.nationalId') ?? '') ===
    reviewerNationalId
  const isSellerCoOwner = sellerCoOwner.find(
    (reviewerItems) => reviewerItems.nationalId === reviewerNationalId,
  )
  const isBuyerOperator = buyerCoOwnerAndOperator
    .filter(({ wasRemoved }) => wasRemoved !== 'true')
    .find(
      (reviewerItems) =>
        reviewerItems.nationalId === reviewerNationalId &&
        reviewerItems.type === 'operator',
    )

  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.vehicle.title)}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text>
            {getValueViaPath<string>(answers, 'pickVehicle.type') ?? ''}
          </Text>
          <Text>
            {carColor ? `${carColor} - ` : ''}
            {carPlate}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          {(!isBuyerOperator || isSeller || isSellerCoOwner) &&
            salePrice.length > 0 && (
              <Text>
                {`${formatMessage(overview.labels.salePrice)} ${formatIsk(
                  parseInt(salePrice, 10),
                )}`}
              </Text>
            )}
          <Text>{`${formatMessage(
            overview.labels.agreementDate,
          )} ${dateOfContract}`}</Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          {(!isBuyerOperator || isSeller || isSellerCoOwner) &&
            mileage.length > 0 && (
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
