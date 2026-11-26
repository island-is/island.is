import { useQuery } from '@apollo/client'
import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import { GET_PAYMENT_CATALOG } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  GridColumn as Column,
  GridRow as Row,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../context/ControlContext'
import { FieldTextInput } from '../FieldTextInput'

export const PaymentField = () => {
  const { formatMessage } = useIntl()
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
    <Stack space={2}>
      <FieldTextInput
        property="informationText"
        label={formatMessage(m.informationText)}
        englishLabel={formatMessage(m.informationTextEnglish)}
      />
      <FieldTextInput
        property="tooltip"
        label={formatMessage(m.tooltip)}
        englishLabel={formatMessage(m.tooltipEnglish)}
      />
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
                  performingOrgID: paymentSettings?.performingOrgID || '',
                  update: updateActiveItem,
                },
              })
            }}
          />
        </Column>
      </Row>
    </Stack>
  )
}
