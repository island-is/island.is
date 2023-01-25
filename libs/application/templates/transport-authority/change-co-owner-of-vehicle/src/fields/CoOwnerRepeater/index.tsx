import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { OwnerCoOwnersInformation } from '../../shared'
import { CoOwnerRepeaterItem } from './CoOwnerRepeaterItem'

export const CoOwnerRepeater: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray<OwnerCoOwnersInformation>({
    name: 'coOwners',
  })

  const handleAdd = (operator?: OwnerCoOwnersInformation) =>
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
      setValue('coOwners', [])
    }
  }, [fields, setValue])

  return (
    <Box>
      {fields.length > 0 ? (
        fields.map((field, index) => {
          return (
            <CoOwnerRepeaterItem
              id="coOwners"
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
          {formatMessage(information.labels.coOwner.coOwnerTempTitle)}
        </Text>
      )}
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        onClick={handleAdd.bind(null, undefined)}
      >
        {formatMessage(information.labels.coOwner.add)}
      </Button>
    </Box>
  )
}
