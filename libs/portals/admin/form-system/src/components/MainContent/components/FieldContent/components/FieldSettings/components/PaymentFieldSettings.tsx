import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/ui'
import {
  Checkbox,
  GridColumn as Column,
  Input,
  GridRow as Row,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext, useMemo } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'

export const PaymentFieldSettings = () => {
  const { control, controlDispatch, setFocus, focus, updateActiveItem } =
    useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const { minValue, maxValue } = currentItem.fieldSettings || {}

  const paymentFields = useMemo(
    () =>
      control.form.fields?.filter(
        (field) => field?.fieldType === FieldTypesEnum.PAYMENT,
      ) ?? [],
    [control.form.fields],
  )

  console.log('paymentFields', paymentFields)
  return (
    <Stack space={2}>
      <Row>
        <Column span="4/12">
          <Input
            name="minQuantity"
            backgroundColor="blue"
            label="Lágmarks fjöldi"
            type="number"
            value={minValue ?? ''}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'minValue',
                  value:
                    e.target.value === '' ? undefined : Number(e.target.value),
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
        <Column span="4/12">
          <Input
            name="maxQuantity"
            backgroundColor="blue"
            label="Hámarks fjöldi"
            type="number"
            value={maxValue ?? ''}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'maxValue',
                  value:
                    e.target.value === '' ? undefined : Number(e.target.value),
                },
              })
            }
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && updateActiveItem()}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label="Nota fellilista"
            checked={currentItem.fieldSettings?.isDropdown ?? false}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'isDropdown',
                  value: e.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Text variant="h5">Tengja við:</Text>
        </Column>
      </Row>
      {paymentFields.map((field) => {
        const latestField = control.form.fields?.find(
          (f) => f?.id === field?.id,
        ) as FormSystemField

        return (
          <Checkbox
            key={field?.id}
            label={field?.name?.is ?? ''}
            checked={
              latestField?.fieldSettings?.paymentQuantityId === currentItem.id
            }
            onChange={() =>
              controlDispatch({
                type: 'SET_PAYMENT_QUANTITY_SETTINGS',
                payload: {
                  paymentField: latestField,
                  paymentQuantityId: currentItem.id,
                  update: updateActiveItem,
                },
              })
            }
          />
        )
      })}
    </Stack>
  )
}
