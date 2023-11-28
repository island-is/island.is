// All operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { information, review } from '../../../lib/messages'
import { ReviewScreenProps } from '../../../shared'
import { ReviewGroup } from '../../ReviewGroup'
import kennitala from 'kennitala'
import { formatPhoneNumber } from '../../../utils'

export const OperatorSection: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ buyerOperators = [], reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()

  return buyerOperators.length > 0 ? (
    <ReviewGroup isLast>
      <GridRow>
        {buyerOperators?.map(
          ({ name, nationalId, email, phone }, index: number) => {
            if (!name || name.length === 0) return null
            const isOperator = nationalId === reviewerNationalId
            return (
              <GridColumn
                span={['12/12', '12/12', '12/12', '6/12']}
                key={`operator-${index}`}
              >
                <Box marginBottom={buyerOperators.length === index + 1 ? 0 : 2}>
                  <Text variant="h4">
                    {formatMessage(information.labels.operator.title)}
                    {isOperator && `(${formatMessage(review.status.youLabel)})`}
                  </Text>
                  <Text>{name}</Text>
                  <Text>{kennitala.format(nationalId || '', '-')}</Text>
                  <Text>{email}</Text>
                  <Text>{formatPhoneNumber(phone || '')}</Text>
                </Box>
              </GridColumn>
            )
          },
        )}
      </GridRow>
    </ReviewGroup>
  ) : null
}
