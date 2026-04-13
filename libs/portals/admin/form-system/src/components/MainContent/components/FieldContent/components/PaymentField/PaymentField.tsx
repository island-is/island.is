import { useQuery } from '@apollo/client'
import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import { GET_PAYMENT_CATALOG } from '@island.is/form-system/graphql'
import {
  GridColumn as Column,
  GridRow as Row,
  Select,
} from '@island.is/island-ui/core'
import { useContext, useEffect } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'

const SYSLUMENNID = '6509142520' // Example organization ID, replace with actual ID as needed
export const PaymentField = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { data, loading, error } = useQuery(GET_PAYMENT_CATALOG, {
    variables: {
      input: {
        performingOrganizationID: SYSLUMENNID,
      },
    },
  })

  if (loading) {
    return <>Loading...</>
  }

  const catalogItems = data?.paymentCatalog?.items || []
  const catalogNames = catalogItems.map((item: PaymentCatalogItem) => {
    return {
      label: `${item.chargeItemCode} - ${item.chargeItemName}`,
      value: item.chargeItemCode,
    }
  })

  useEffect(() => {
    console.log('Payment catalog data:', data)
    console.log('Current item:', currentItem)
    console.log('Field settings:', fieldSettings)
  }, [data, currentItem, fieldSettings])

  return (
    <>
      <Row>
        <Column span="6/12">
          <Select
            label="Greiðsluvörulisti"
            options={catalogNames}
            placeholder="Veldu greiðsluvöru"
            isSearchable
            backgroundColor="blue"
            onChange={(e) => {
              const paymentSettings = data.paymentCatalog?.items.find(
                (item: PaymentCatalogItem) => item.chargeItemCode === e?.value,
              )
              console.log('Selected payment settings:', paymentSettings)
              controlDispatch({
                type: 'SET_PAYMENT_SETTINGS',
                payload: {
                  ...paymentSettings,
                  update: updateActiveItem,
                },
              })
            }}
          />
        </Column>
      </Row>
    </>
  )
}
