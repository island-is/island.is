import { useMutation } from '@apollo/client'
import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import { DELETE_FIELD } from '@island.is/form-system/graphql'
import {
  Box,
  Button,
  GridColumn as Column,
  GridRow as Row,
  Select,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'

interface Props {
  field: FormSystemField
  paymentCatalog: PaymentCatalogItem[]
  catalogNames: { label: string; value: string }[]
  paymentFields: FormSystemField[]
}

export const PaymentItem = ({
  field,
  paymentCatalog,
  catalogNames,
  paymentFields,
}: Props) => {
  const { controlDispatch, updateActiveItem, formUpdate } =
    useContext(ControlContext)
  const deleteField = useMutation(DELETE_FIELD)[0]
  const { fieldSettings } = field

  const handleRemove = async () => {
    const result = await deleteField({
      variables: { input: { id: field.id } },
    })
    if (!result.errors) {
      controlDispatch({
        type: 'REMOVE_FIELD',
        payload: {
          id: field.id,
          skipActiveItem: true,
        },
      })
      if (paymentFields.filter((f) => f.id !== field.id).length === 0) {
        controlDispatch({
          type: 'CHANGE_HAS_PAYMENT',
          payload: {
            value: false,
            update: formUpdate,
          },
        })
      }
    }
  }
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
              onClick={handleRemove}
              size="small"
              icon="trash"
            />
          </Box>
        </Column>
      </Row>
    </Box>
  )
}
