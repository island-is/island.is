import React, { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { PropertyField } from '../../lib/constants'
import * as styles from './PropertyRepeater.css'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { isValidRealEstate } from '../../lib/utils'
import { error as errorMsg } from '../../lib/error'

export const PropertyRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { id, title } = field
  const { fields, append, remove } = useFieldArray({
    name: `${id}`,
  })

  // Errors come in with `properties.id` as the key
  // We need to get the last part of the id to get the correct error for the fields
  let error: undefined | string = undefined
  if (errors) {
    error = getValueViaPath(errors, `properties.${id.split('.').pop() ?? ''}`)
  }

  const repeaterTitle = formatText(title, application, formatMessage)
  const handleAddProperty = () =>
    append({
      propertyNumber: '',
      address: '',
      spaceNumber: '',
      customerCount: '',
    })

  useEffect(() => {
    if (fields.length < 1) {
      handleAddProperty()
    }
  }, [])

  return (
    <Box>
      {fields.map((item, index) => (
        <PropertyItem
          error={error}
          field={item}
          fieldName={id}
          index={index}
          remove={remove}
          key={`${id}[${index}]`}
          title={repeaterTitle}
        />
      ))}
      <Box marginTop={1} marginBottom={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddProperty}
          size="medium"
        >
          {formatMessage(m.addProperty)} {repeaterTitle.toLowerCase()}
        </Button>
      </Box>
    </Box>
  )
}

const PropertyItem = ({
  field,
  index,
  remove,
  fieldName,
  error,
  title,
}: {
  field: PropertyField
  fieldName: string
  index: number
  remove: (index: number) => void
  error?: any
  title: string
}) => {
  const fieldIndex = `${fieldName}.${index}`
  const propertyNumberField = `${fieldIndex}.propertyNumber`
  const addressField = `${fieldIndex}.address`
  const spaceNumberField = `${fieldIndex}.spaceNumber`
  const customerCountField = `${fieldIndex}.customerCount`

  const propertyNumberInput = useWatch({
    name: propertyNumberField,
    defaultValue: '',
  })
  const address = useWatch({ name: addressField, defaultValue: '' })
  const spaceNumber = useWatch({ name: spaceNumberField })
  const customerCount = useWatch({ name: customerCountField })

  const { control, setValue, clearErrors, setError } = useFormContext()
  const { formatMessage } = useLocale()

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          clearErrors([addressField, spaceNumberField, customerCountField])
          setValue(
            addressField,
            data.searchForProperty?.defaultAddress?.display ?? '',
          )
        },
        fetchPolicy: 'network-only',
      },
    )

  useEffect(() => {
    const propertyNumber: string = propertyNumberInput.trim().toUpperCase()
    setValue(address, '') // Reset address when property number changes

    if (isValidRealEstate(propertyNumber)) {
      getProperty({
        variables: {
          input: {
            propertyNumber,
          },
        },
      })
    } else {
      setError(address, {
        message: formatMessage(m.errorPropertyNumber),
        type: 'validate',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProperty, propertyNumberInput, setError, setValue, addressField])

  const hasPropertyNumberButEmptyAddress = propertyNumberInput && !address

  return (
    <Box position="relative" marginTop={2}>
      <Controller
        name={fieldIndex}
        control={control}
        render={() => <input type="hidden" />}
      />
      <Text variant="h5" as="h5" paddingBottom={2}>
        {title} {index + 1}
      </Text>
      {index !== 0 && (
        <Box
          position="absolute"
          className={styles.removeFieldButton}
          paddingBottom={2}
        >
          <Button
            variant="ghost"
            size="small"
            circle
            icon="remove"
            onClick={() => remove(index)}
          />
        </Box>
      )}
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={propertyNumberField}
            name={propertyNumberField}
            label={formatMessage(m.propertyNumber)}
            backgroundColor="blue"
            defaultValue={field.propertyNumber}
            loading={queryLoading}
            error={
              hasPropertyNumberButEmptyAddress && !queryLoading
                ? formatMessage(errorMsg.missingAddressForPropertyNumber)
                : !propertyNumberInput
                ? (error as string)
                : undefined
            }
            placeholder="F1234567"
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={addressField}
            name={addressField}
            label={formatMessage(m.address)}
            readOnly
            defaultValue={field.address}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={spaceNumberField}
            name={spaceNumberField}
            label={formatMessage(m.spaceNumber)}
            backgroundColor="blue"
            format="#########"
            defaultValue={field.spaceNumber?.toString()}
            error={
              !spaceNumber && error && typeof error === 'string'
                ? error
                : undefined
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={customerCountField}
            name={customerCountField}
            label={formatMessage(m.customerCount)}
            backgroundColor="blue"
            format="#########"
            defaultValue={field.customerCount?.toString()}
            error={(error && !customerCount) ?? error}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
