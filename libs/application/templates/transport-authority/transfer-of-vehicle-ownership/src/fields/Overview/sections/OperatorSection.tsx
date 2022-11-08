// All operators
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { information } from '../../../lib/messages'
import { CoOwnerAndOperator } from '../../../types'
import { ReviewGroup } from '../../ReviewGroup'

export const OperatorSection: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const coOwnersAndOperators = getValueViaPath(
    answers,
    'coOwnerAndOperator',
    [],
  ) as CoOwnerAndOperator[]
  const operators = coOwnersAndOperators.filter((x) => x.type === 'operator')

  return operators.length > 0 ? (
    <ReviewGroup isLast>
      <GridRow>
        {operators?.map(({ name, nationalId, email }, index: number) => {
          if (name.length === 0) return null
          return (
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              key={`operator-${index}`}
            >
              <Box marginBottom={operators.length === index + 1 ? 0 : 2}>
                <Text variant="h4">
                  {formatMessage(information.labels.operator.title)}{' '}
                  {operators.length > 1 ? index + 1 : ''}{' '}
                  {operators.length > 1 && index === 0 ? '(aðal)' : ''}
                </Text>
                <Text>{name}</Text>
                <Text>{nationalId}</Text>
                <Text>{email}</Text>
              </Box>
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  ) : null
}
