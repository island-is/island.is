import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { useLocale } from '@island.is/localization'
import { information } from '../../../lib/messages'
import { ReviewGroup } from '../../ReviewGroup'
import { CoOwnerAndOperator, ReviewScreenProps } from '../../../types'

export const VehicleSection: FC<FieldBaseProps & ReviewScreenProps> = ({
  application,
  reviewerNationalId = '',
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const dateOfContract = format(
    parseISO(getValueViaPath(answers, 'vehicle.date', '') as string),
    'dd.MM.yyyy',
    {
      locale: is,
    },
  )
  const salePrice = getValueViaPath(answers, 'vehicle.salePrice', '') as string
  const buyerCoOwnerAndOperator = getValueViaPath(
    answers,
    'buyerCoOwnerAndOperator',
    [],
  ) as CoOwnerAndOperator[]
  const isOperator = buyerCoOwnerAndOperator.find(
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
          <Text>{getValueViaPath(answers, 'vehicle.type', '') as string}</Text>
          <Text>
            {
              /* TODO: Add color too */ getValueViaPath(
                answers,
                'vehicle.plate',
                '',
              ) as string
            }
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          {!isOperator && salePrice.length > 0 && (
            <Text>
              Söluverð:{' '}
              {getValueViaPath(answers, 'vehicle.salePrice', '') as string} kr.
            </Text>
          )}
          <Text>Dagsetning samnings: {dateOfContract}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
