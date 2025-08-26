// Seller and sellers coowner
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, overview, review } from '../../../lib/messages'
import { UserInformation, ReviewScreenProps } from '../../../shared'
import { ReviewGroup } from '../../ReviewGroup'
import kennitala from 'kennitala'
import { formatPhoneNumber } from '../../../utils'

export const SellerSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const coOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as UserInformation[]
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
        {coOwners?.map(({ name, nationalId, email, phone }, index: number) => {
          const isCoOwner = nationalId === reviewerNationalId
          return (
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              key={`sellers-coowner-${index}`}
            >
              <Box marginBottom={coOwners.length === index + 1 ? 0 : 2}>
                <Text variant="h4">
                  {formatMessage(overview.labels.sellersCoOwner)}{' '}
                  {coOwners.length > 1 ? index + 1 : ''}{' '}
                  {isCoOwner && `(${formatMessage(review.status.youLabel)})`}
                </Text>
                <Text>{name}</Text>
                <Text>{nationalId}</Text>
                <Text>{email}</Text>
                <Text>{formatPhoneNumber(phone)}</Text>
              </Box>
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  )
}
