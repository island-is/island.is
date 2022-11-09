// Seller and sellers coowner
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information, overview } from '../../../lib/messages'
import { UserInformation } from '../../../types'
import { ReviewGroup } from '../../ReviewGroup'

export const SellerSection: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const coOwners = getValueViaPath(
    answers,
    'sellerCoOwner',
    [],
  ) as UserInformation[]

  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(information.labels.seller.title)}
          </Text>
          <Text>{getValueViaPath(answers, 'seller.name', '') as string}</Text>
          <Text>
            {getValueViaPath(answers, 'seller.nationalId', '') as string}
          </Text>
          <Text>{getValueViaPath(answers, 'seller.email', '') as string}</Text>
          <Text>{getValueViaPath(answers, 'seller.phone', '') as string}</Text>
        </GridColumn>
        {coOwners?.map(({ name, nationalId, email, phone }, index: number) => {
          return (
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              key={`sellers-coowner-${index}`}
            >
              <Box marginBottom={coOwners.length === index + 1 ? 0 : 2}>
                <Text variant="h4">
                  {formatMessage(overview.labels.sellersCoOwner)}{' '}
                  {coOwners.length > 1 ? index + 1 : ''}
                </Text>
                <Text>{name}</Text>
                <Text>{nationalId}</Text>
                <Text>{email}</Text>
                <Text>{phone}</Text>
              </Box>
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  )
}
