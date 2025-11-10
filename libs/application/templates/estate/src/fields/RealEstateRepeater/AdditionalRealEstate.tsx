import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'
import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'
import { isValidRealEstate } from '../../lib/utils'

export const AdditionalRealEstate = ({
  field,
  index,
  remove,
  fieldName,
  error,
  calculateTotal,
}: {
  field: AssetFormField
  fieldName: string
  index: number
  remove: (index: number) => void
  error: ErrorValue
  calculateTotal?: () => void
}) => {
  const fieldIndex = `${fieldName}[${index}]`
  const propertyNumberField = `${fieldIndex}.assetNumber`
  const propertyNumberInput = useWatch({
    name: propertyNumberField,
    defaultValue: '',
  })
  const addressField = `${fieldIndex}.description`
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const marketValueField = `${fieldIndex}.marketValue`
  const shareField = `${fieldIndex}.share`

  const { control, setValue, clearErrors, setError } = useFormContext()
  const { formatMessage } = useLocale()
  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          clearErrors(addressField)
          setValue(
            addressField,
            data.searchForProperty?.defaultAddress?.display ?? '',
          )
        },
        fetchPolicy: 'network-only',
      },
    )

  useEffect(() => {
    // According to Skra.is:
    // https://www.skra.is/um-okkur/frettir/frett/2018/03/01/Nytt-fasteignanumer-og-itarlegri-skraning-stadfanga/
    // The property number is a seven digit informationless sequence with prefix F
    // The lot number is a six digit informationless sequence with prefix L
    const propertyNumber = propertyNumberInput.trim().toUpperCase()
    setValue(addressField, '')

    if (isValidRealEstate(propertyNumber)) {
      clearErrors(propertyNumberField)
      getProperty({
        variables: {
          input: {
            propertyNumber,
          },
        },
      })
    } else {
      setError(propertyNumberField, {
        message: formatMessage(m.errorPropertyNumber),
        type: 'validate',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProperty, propertyNumberInput, setValue, setError])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={enabledField}
        control={control}
        defaultValue={field.enabled || false}
        render={() => <input type="hidden" />}
      />
      <Text variant="h4">{formatMessage(m.realEstateRepeaterHeader)}</Text>
      <Box position="absolute" className={styles.removeFieldButton}>
        <Button
          variant="ghost"
          size="small"
          circle
          icon="remove"
          onClick={() => remove(index)}
        />
      </Box>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
          <InputController
            id={propertyNumberField}
            name={propertyNumberField}
            label={formatMessage(m.propertyNumber)}
            backgroundColor="blue"
            defaultValue={field.assetNumber}
            error={
              error?.assetNumber
                ? formatMessage(m.errorPropertyNumber)
                : undefined
            }
            placeholder="F1234567"
            required
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
          <InputController
            id={addressField}
            name={addressField}
            label={formatMessage(m.address)}
            loading={queryLoading}
            readOnly
            defaultValue={field.description}
            error={error?.description}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={shareField}
            label={formatMessage(m.propertyShare)}
            defaultValue={String(field.share)}
            onChange={(e) => {
              setValue(shareField, Number(e.target.value.replace('%', '')))
            }}
            error={error?.share}
            type="number"
            suffix="%"
            required
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={marketValueField}
            name={marketValueField}
            label={formatMessage(m.realEstateValueTitle)}
            defaultValue={field.marketValue}
            placeholder="0 kr."
            error={error?.marketValue}
            currency
            required
            onChange={() => calculateTotal?.()}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default AdditionalRealEstate
