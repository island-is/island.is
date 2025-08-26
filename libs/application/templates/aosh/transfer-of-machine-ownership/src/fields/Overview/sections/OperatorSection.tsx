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
> = ({ buyerOperator = {}, reviewerNationalId = '' }) => {
  const { formatMessage } = useLocale()

  // Check if buyerOperator exists and has valid properties
  if (!buyerOperator || Object.keys(buyerOperator).length === 0) {
    return null
  }

  const { name, nationalId, email, phone } = buyerOperator

  if (!name || name.length === 0) {
    return null
  }

  const isOperator = nationalId === reviewerNationalId

  return (
    <ReviewGroup isLast>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box marginBottom={2}>
            <Text variant="h4">
              {formatMessage(information.labels.operator.title)}
              {isOperator && `(${formatMessage(review.status.youLabel)})`}
            </Text>
            <Text>{name}</Text>
            <Text>{kennitala.format(nationalId || '')}</Text>
            <Text>{email}</Text>
            <Text>{formatPhoneNumber(phone || '')}</Text>
          </Box>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
