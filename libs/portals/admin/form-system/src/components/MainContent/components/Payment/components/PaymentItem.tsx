import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  GridColumn as Column,
  GridRow as Row,
  Select,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'
import { toUndefined } from '../../../../../lib/utils/toUndefined'

interface Props {
  field: FormSystemField
  paymentCatalog: PaymentCatalogItem[]
  catalogNames: { label: string; value: string }[]
}

export const PaymentItem = ({ field, paymentCatalog, catalogNames }: Props) => {
  const { controlDispatch, updateActiveItem } = useContext(ControlContext)
  const { fieldSettings } = field
  return (
    <Box border="standard" borderRadius="large" padding={3}>
      <Row>
        <Column span="8/12">
          <Select
            label="Greiðsluvörulisti"
            options={catalogNames}
            placeholder="Veldu greiðsluvöru"
            isSearchable
            backgroundColor="blue"
            onChange={(e) => {
              const paymentSettings = paymentCatalog.find(
                (item: PaymentCatalogItem) => item.chargeItemCode === e?.value,
              )
              controlDispatch({
                type: 'SET_PAYMENT_SETTINGS',
                payload: {
                  ...paymentSettings,
                  chooseQuantity: false,
                  field,
                  update: updateActiveItem,
                },
              })
            }}
            value={catalogNames.find(
              (item) => item.value === fieldSettings?.chargeItemCode,
            )}
          />
        </Column>
        <Column span="4/12">
          <Box
            display="flex"
            justifyContent="flexEnd"
            marginBottom={2}
            width="full"
          >
            <Button
              name={`remove-${field.id}`}
              variant="ghost"
              colorScheme="destructive"
              onClick={() => {
                controlDispatch({
                  type: 'REMOVE_FIELD',
                  payload: {
                    id: field.id,
                    skipActiveItem: true,
                  },
                })
              }}
              size="small"
              icon="trash"
            />
          </Box>
        </Column>
      </Row>
      <Row>
        <Column span="12/12">
          <Box marginTop={2}>
            <Checkbox
              label="Fjölda val"
              checked={fieldSettings?.chooseQuantity || false}
              onChange={(e) => {
                controlDispatch({
                  type: 'SET_PAYMENT_SETTINGS',
                  payload: {
                    ...fieldSettings,
                    chargeItemCode: toUndefined(fieldSettings?.chargeItemCode),
                    chargeItemName: toUndefined(fieldSettings?.chargeItemName),
                    chargeType: toUndefined(fieldSettings?.chargeType),
                    performingOrgID: toUndefined(
                      fieldSettings?.performingOrgID,
                    ),
                    priceAmount: toUndefined(fieldSettings?.priceAmount),
                    chooseQuantity: e.target.checked,
                    field,
                    update: updateActiveItem,
                  },
                })
              }}
            />
          </Box>
        </Column>
      </Row>
      {/* <Box marginTop={2}>
        <Stack space={1}>
          <Text>
            {`ChargeItemCode: ${fieldSettings?.chargeItemCode || 'Ekki skráð'}`}
          </Text>
          <Text>
            {`ChargeItemName: ${fieldSettings?.chargeItemName || 'Ekki skráð'}`}
          </Text>
          <Text>
            {`ChargeType: ${fieldSettings?.chargeType || 'Ekki skráð'}`}
          </Text>
          <Text>
            {`PriceAmount: ${
              fieldSettings?.priceAmount !== undefined
                ? fieldSettings.priceAmount
                : 'Ekki skráð'
            }`}
          </Text>
        </Stack>
      </Box> */}
    </Box>
  )
}
