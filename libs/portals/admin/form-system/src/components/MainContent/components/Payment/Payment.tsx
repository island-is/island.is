import { useMutation, useQuery } from '@apollo/client'
import { FormSystemField, PaymentCatalogItem } from '@island.is/api/schema'
import {
  CREATE_FIELD,
  GET_PAYMENT_CATALOG,
  removeTypename,
} from '@island.is/form-system/graphql'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridColumn as Column,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { PaymentItem } from './components/PaymentItem'

const SYSLUMENNID = '6509142520' // Example organization ID, replace with actual ID as needed

export const Payment = () => {
  const { control, controlDispatch, formUpdate } = useContext(ControlContext)
  const { sections, screens, fields, hasPayment } = control.form
  const paymentSection = sections?.find(
    (s) => s?.sectionType === SectionTypes.PAYMENT,
  )
  const paymentScreen = screens?.find(
    (s) => s?.sectionId === paymentSection?.id,
  )
  const paymentFields =
    fields?.filter((f) => f?.screenId === paymentScreen?.id) || []

  const createField = useMutation(CREATE_FIELD)
  const { data, loading } = useQuery(GET_PAYMENT_CATALOG, {
    variables: {
      input: {
        performingOrganizationID: SYSLUMENNID,
      },
    },
  })

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
        }}
      >
        <LoadingDots />
      </div>
    )
  }

  const paymentCatalog = data?.paymentCatalog?.items || []
  const catalogNames = paymentCatalog.map((item: PaymentCatalogItem) => {
    return {
      label: `${item.chargeItemCode} - ${item.chargeItemName}`,
      value: item.chargeItemCode,
    }
  })

  const addField = async () => {
    const newField = await createField[0]({
      variables: {
        input: {
          createFieldDto: {
            screenId: paymentScreen?.id,
            fieldType: FieldTypesEnum.PAYMENT,
            displayOrder: paymentFields.length,
          },
        },
      },
    })
    if (newField) {
      controlDispatch({
        type: 'ADD_FIELD',
        payload: {
          field: removeTypename(
            newField.data?.createFormSystemField,
          ) as FormSystemField,
          skipActiveItem: true,
        },
      })
      if (!hasPayment) {
        controlDispatch({
          type: 'CHANGE_HAS_PAYMENT',
          payload: {
            value: true,
            update: formUpdate,
          },
        })
      }
    }
  }

  return (
    <>
      <Box paddingBottom={2}>
        <Column span="12/12">
          <Box width="full" justifyContent="flexEnd" display="flex">
            <Button variant="primary" preTextIcon="add" onClick={addField}>
              Bæta við greiðslu
            </Button>
          </Box>
        </Column>
      </Box>
      <Stack space={2}>
        {paymentFields.map((field) => (
          <PaymentItem
            key={field?.id}
            field={field as FormSystemField}
            paymentCatalog={paymentCatalog}
            catalogNames={catalogNames}
            paymentFields={paymentFields as FormSystemField[]}
          />
        ))}
      </Stack>
    </>
  )
}
