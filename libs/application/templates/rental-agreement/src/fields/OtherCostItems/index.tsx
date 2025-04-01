import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { otherFees as tOtherFees } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { parseCurrency } from '../../lib/utils'

const MAX_COST_ITEMS = 3
const SPACING = 3

type CostField = {
  description: string
  amount?: number
}

const initialCostItems = [
  {
    description: '',
    amount: undefined,
  },
]

const getAmountValue = (value: string) => {
  return value === '' ? undefined : Number(parseCurrency(value))
}

export const OtherCostItems: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
}) => {
  const { formatMessage } = useLocale()

  const { setValue, getValues } = useFormContext()
  const { id } = field
  const storedValue = getValues(id)

  const [costItems, setCostItems] = useState<CostField[]>(
    storedValue?.length ? storedValue : initialCostItems,
  )

  const handleUpdateValues = (items: CostField[]) => {
    setCostItems(items)
    setValue(id, items)
  }

  const handleInputChange = (
    index: number,
    field: keyof CostField,
    value: string,
  ) => {
    const updatedItems = [...costItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'amount' ? getAmountValue(value) : value,
    }
    handleUpdateValues(updatedItems)
  }

  const addCostItem = () => {
    if (costItems.length < MAX_COST_ITEMS) {
      handleUpdateValues([...costItems, { description: '', amount: undefined }])
    }
  }

  return (
    <Box marginTop={SPACING}>
      <Stack space={SPACING}>
        {costItems.map((costItem, index) => (
          <GridRow rowGap={SPACING} key={index}>
            <GridColumn span={['12/12', '6/12', '6/12']}>
              <Input
                name={`otherFees.otherCostItems[${index}].description`}
                label={formatMessage(tOtherFees.otherCostsDescriptionLabel)}
                placeholder={formatMessage(
                  tOtherFees.otherCostsDescriptionPlaceholder,
                )}
                backgroundColor={'blue'}
                value={costItem.description}
                onChange={(e) =>
                  handleInputChange(index, 'description', e.target.value)
                }
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12', '6/12']}>
              <InputController
                id={`otherFees.otherCostItems[${index}].amount-id`}
                name={`otherFees.otherCostItems[${index}].amount`}
                label={formatMessage(tOtherFees.otherCostsAmountLabel)}
                placeholder={formatMessage(
                  tOtherFees.otherCostsAmountPlaceholder,
                )}
                currency
                type="number"
                backgroundColor="blue"
                suffix=" kr."
                inputMode="numeric"
                defaultValue={costItem.amount?.toString()}
                onChange={(e) => {
                  handleInputChange(index, 'amount', e.target.value)
                }}
              />
            </GridColumn>
          </GridRow>
        ))}
        <Button
          icon="add"
          variant="ghost"
          type="button"
          size="small"
          disabled={costItems.length >= MAX_COST_ITEMS}
          onClick={addCostItem}
        >
          {formatMessage(tOtherFees.otherCostsAddLine)}
        </Button>
      </Stack>
    </Box>
  )
}
