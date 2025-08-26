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
> = ({
  coOwnersAndOperators = [],
  reviewerNationalId = '',
  mainOperator = '',
}) => {
  const { formatMessage } = useLocale()
  const operators = coOwnersAndOperators.filter((x) => x.type === 'operator')

  return operators.length > 0 ? (
    <ReviewGroup isLast>
      <GridRow>
        {operators?.map(({ name, nationalId, email, phone }, index: number) => {
          if (!name || name.length === 0) return null
          const isOperator = nationalId === reviewerNationalId
          return (
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              key={`operator-${index}`}
            >
              <Box marginBottom={operators.length === index + 1 ? 0 : 2}>
                <Text variant="h4">
                  {formatMessage(information.labels.operator.title)}{' '}
                  {operators.length > 1 ? index + 1 : ''}{' '}
                  {operators.length > 1 && mainOperator === nationalId
                    ? `(${formatMessage(information.labels.operator.main)})`
                    : ''}{' '}
                  {isOperator && `(${formatMessage(review.status.youLabel)})`}
                </Text>
                <Text>{name}</Text>
                <Text>{kennitala.format(nationalId!)}</Text>
                <Text>{email}</Text>
                <Text>{formatPhoneNumber(phone!)}</Text>
              </Box>
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  ) : null
}
