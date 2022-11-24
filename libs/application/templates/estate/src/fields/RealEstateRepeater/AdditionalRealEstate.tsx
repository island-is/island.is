import { useEffect } from 'react'
import {
  ArrayField,
  Controller,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { Asset } from '../../types'
import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'

export const AdditionalRealEstate = ({
  field,
  index,
  remove,
  fieldName,
  error,
}: {
  field: Partial<ArrayField<Asset, 'id'>>
  fieldName: string
  index: number
  remove: (index: number) => void
  error: any
}) => {
  const fieldIndex = `${fieldName}[${index}]`
  const propertyNumberField = `${fieldIndex}.assetNumber`
  const propertyNumberInput = useWatch({
    name: propertyNumberField,
    defaultValue: '',
  })
  const addressField = `${fieldIndex}.description`
  const address = useWatch({ name: addressField, defaultValue: '' })
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const dummyField = `${fieldIndex}.dummy`
  const { control, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const [
    getProperty,
    { loading: queryLoading, error: _queryError },
  ] = useLazyQuery<Query, { input: SearchForPropertyInput }>(
    SEARCH_FOR_PROPERTY_QUERY,
    {
      onCompleted: (data) => {
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
    // The property number is a seven digit informationless sequence.
    // Has the prefix F.
    if (/[Ff]{0,1}\d{7}$/.test(propertyNumberInput.trim().toUpperCase())) {
      getProperty({
        variables: {
          input: {
            propertyNumber: propertyNumberInput.trim().toUpperCase(),
          },
        },
      })
    } else {
      setValue(addressField, '')
    }
  }, [getProperty, address, addressField, propertyNumberInput, setValue])

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
      <Controller
        name={dummyField}
        control={control}
        defaultValue={field.dummy || false}
        render={() => <input type="hidden" />}
      />
      <Text variant="h4">
        {formatMessage(m.realEstateRepeaterHeader) + ' ' + (index + 1)}
      </Text>
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
            error={error?.assetNumber ?? undefined}
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
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default AdditionalRealEstate
