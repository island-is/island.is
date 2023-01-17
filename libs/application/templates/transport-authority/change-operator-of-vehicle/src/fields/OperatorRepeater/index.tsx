import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { OperatorFormField } from '../../shared'
import { OperatorRepeaterItem } from './OperatorRepeaterItem'

export const OperatorRepeater: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: 'operators',
  })

  const handleAdd = (operator?: OperatorFormField) =>
    append({
      name: operator?.name || '',
      nationalId: operator?.nationalId || '',
      email: operator?.email || '',
      phone: operator?.phone || '',
    })

  const handleRemove = (index: number) => {
    remove(index)
  }

  useEffect(() => {
    if (fields.length === 0) {
      setValue('operators', [])
    }
  }, [fields, setValue])

  return (
    <Box>
      {fields.length > 0 ? (
        fields.map((field, index) => {
          return (
            <OperatorRepeaterItem
              id="operators"
              repeaterField={field}
              index={index}
              rowLocation={index + 1}
              key={field.id}
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
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        onClick={handleAdd.bind(null, undefined)}
      >
        {formatMessage(information.labels.operator.add)}
      </Button>
    </Box>
  )
}
