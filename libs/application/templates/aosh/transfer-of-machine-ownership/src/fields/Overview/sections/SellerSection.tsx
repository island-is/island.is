// Seller
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, review } from '../../../lib/messages'
import { ReviewScreenProps } from '../../../shared'
import { ReviewGroup } from '../../ReviewGroup'
import kennitala from 'kennitala'
import { formatPhoneNumber } from '../../../utils'

export const SellerSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const isSeller =
    (getValueViaPath(answers, 'seller.nationalId', '') as string) ===
    reviewerNationalId
  const phonenumber = getValueViaPath(answers, 'seller.phone', '') as string

  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.seller.title)}{' '}
            {isSeller && `(${formatMessage(review.status.youLabel)})`}
          </Text>
          <Text>{getValueViaPath(answers, 'seller.name', '') as string}</Text>
          <Text>
            {kennitala.format(
              getValueViaPath(answers, 'seller.nationalId', '') as string,
            )}
          </Text>
          <Text>{getValueViaPath(answers, 'seller.email', '') as string}</Text>
          <Text>{formatPhoneNumber(phonenumber)}</Text>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
