import React, { FC, useState } from 'react'
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
import { otherFees as tOtherFees } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { filterEmptyCostItems, parseCurrency } from '../../lib/utils'
import NumberFormat from 'react-number-format'
import { CostField } from '../../lib/types'

const MAX_COST_ITEMS = 3

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

  // TODO: Ákveða:
  // Ef ég vil hafa það þannig að ég hreinsa upp fyrir notandann ónotaðar línur:
  // const filteredStoredValue = filterEmptyCostItems(storedValue ?? []);
  // Skipta storedValue út fyrir filteredStoredValue hér að neðan
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
    <Box marginTop={3}>
      <Stack space={3}>
        {costItems.map((costItem, index) => (
          <GridRow rowGap={3} key={index}>
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
                required={!!costItem.amount}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12', '6/12']}>
              <NumberFormat
                id={`otherFees.otherCostItems[${index}].amount-id`}
                name={`otherFees.otherCostItems[${index}].amount`}
                label={formatMessage(tOtherFees.otherCostsAmountLabel)}
                placeholder={formatMessage(
                  tOtherFees.otherCostsAmountPlaceholder,
                )}
                value={costItem.amount}
                onValueChange={({ value }) => {
                  handleInputChange(index, 'amount', value)
                }}
                customInput={Input}
                backgroundColor="blue"
                suffix=" kr."
                type="text"
                inputMode="numeric"
                thousandSeparator="."
                decimalSeparator=","
                required={!!costItem.description}
              />
            </GridColumn>
          </GridRow>
        ))}
        {costItems.length < MAX_COST_ITEMS && (
          <Button
            icon="add"
            variant="ghost"
            type="button"
            size="small"
            onClick={addCostItem}
          >
            {formatMessage(tOtherFees.otherCostsAddLine)}
          </Button>
        )}
      </Stack>
    </Box>
  )
}
