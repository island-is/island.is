import { useQuery } from '@apollo/client'
import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import { GET_PAYMENT_CATALOG } from '@island.is/form-system/graphql'
import {
  GridColumn as Column,
  GridRow as Row,
  Select,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'

export const PaymentField = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { isReadOnly } = control
  const currentItem = control.activeItem.data as FormSystemField
  const { data, loading } = useQuery(GET_PAYMENT_CATALOG, {
    variables: {
      input: {
        performingOrganizationID: control.organizationNationalId,
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
            isDisabled={isReadOnly}
            onChange={(e) => {
              const paymentSettings = data.paymentCatalog?.items.find(
                (item: PaymentCatalogItem) => item.chargeItemCode === e?.value,
              )
              controlDispatch({
                type: 'SET_PAYMENT_SETTINGS',
                payload: {
                  field: currentItem,
                  chargeItemCode: paymentSettings?.chargeItemCode || '',
                  chargeItemName: paymentSettings?.chargeItemName || '',
                  chargeType: paymentSettings?.chargeType || '',
                  performingOrgID:
                    paymentSettings?.performingOrganizationID || '',
                  priceAmount: paymentSettings?.priceAmount || 0,
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
