import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useFieldArray } from 'react-hook-form'
import { information } from '../../lib/messages'
import { ReviewCoOwnerAndOperatorFormField } from '../../types'
import { repeaterButtons } from './CoOwnerAndOperatorRepeater.css'
import { CoOwnerAndOperatorRepeaterItem } from './CoOwnerAndOperatorRepeaterItem'

export const CoOwnerAndOperatorRepeater: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()

  const { fields, append, remove } = useFieldArray({
    name: 'buyerCoOwnerAndOperator',
  })

  const handleAdd = (type: 'operator' | 'coOwner') =>
    append({
      name: '',
      nationalId: '',
      email: '',
      phone: '',
      type,
    })

  const handleRemove = (index: number) => remove(index)

  const allOperators = fields.filter(
    (field: ReviewCoOwnerAndOperatorFormField) => field.type === 'operator',
  )
  const allCoOwners = fields.filter(
    (field: ReviewCoOwnerAndOperatorFormField) => field.type === 'coOwner',
  )
  return (
    <Box>
      {fields.map((field: any, index) => {
        const rowLocation =
          field.type === 'operator'
            ? allOperators.indexOf(field)
            : allCoOwners.indexOf(field)
        return (
          <CoOwnerAndOperatorRepeaterItem
            id="buyerCoOwnerAndOperator"
            repeaterField={field}
            index={index}
            rowLocation={rowLocation + 1}
            key={field.id}
            handleRemove={handleRemove}
            {...props}
          />
        )
      })}
      <Box
        display="flex"
        alignItems="stretch"
        flexDirection="row"
        className={repeaterButtons}
        marginTop={3}
      >
        <Button
          variant="ghost"
          icon="add"
          iconType="outline"
          onClick={handleAdd.bind(null, 'coOwner')}
        >
          {formatMessage(information.labels.coOwner.add)}
        </Button>
        <Button
          variant="ghost"
          icon="add"
          iconType="outline"
          onClick={handleAdd.bind(null, 'operator')}
        >
          {formatMessage(information.labels.operator.add)}
        </Button>
      </Box>
    </Box>
  )
}
