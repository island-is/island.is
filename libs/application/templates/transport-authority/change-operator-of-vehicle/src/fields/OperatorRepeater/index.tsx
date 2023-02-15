import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { OperatorInformation } from '../../shared'
import { OperatorRepeaterItem } from './OperatorRepeaterItem'

export const OperatorRepeater: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [operators, setOperators] = useState<OperatorInformation[]>(
    getValueViaPath(
      application.answers,
      'operators',
      [],
    ) as OperatorInformation[],
  )

  const filteredOperators = operators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

  const handleAdd = () =>
    setOperators([
      ...operators,
      {
        name: '',
        nationalId: '',
        email: '',
        phone: '',
      },
    ])

  const handleRemove = (position: number) => {
    if (position > -1) {
      setOperators(
        operators.map((operator, index) => {
          if (index === position) {
            return { ...operator, wasRemoved: 'true' }
          }
          return operator
        }),
      )
    }
  }

  useEffect(() => {
    if (operators.length === 0) {
      setValue('operators', [])
    }
  }, [operators, setValue])

  return (
    <Box>
      {operators.length > 0 ? (
        operators.map((operator, index) => {
          return (
            <OperatorRepeaterItem
              id="operators"
              repeaterField={operator}
              index={index}
              rowLocation={
                filteredOperators.indexOf(operator) > -1
                  ? filteredOperators.indexOf(operator) + 1
                  : index + 1
              }
              key={`operator-${index}`}
              handleRemove={handleRemove}
              {...props}
            />
          )
        })
      ) : (
        <Text variant="h5" marginBottom={2}>
          {formatMessage(information.labels.operator.operatorTempTitle)}
        </Text>
      )}
      <Button variant="ghost" icon="add" iconType="outline" onClick={handleAdd}>
        {formatMessage(information.labels.operator.add)}
      </Button>
    </Box>
  )
}
