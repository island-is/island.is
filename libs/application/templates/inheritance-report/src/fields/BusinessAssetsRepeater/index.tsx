/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, useCallback } from 'react'
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Input,
  Text,
  DropdownMenu,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'
import { getErrorViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import { isValidRealEstate, valueToNumber } from '../../lib/utils/helpers'

type RepeaterProps = {
  field: {
    props: {
      sectionTitle?: string
      sectionTitleVariant?: string
      assetFields: Array<object>
      estateFields: Array<object>
      repeaterButtonText: string
      sumField: string
      fromExternalData?: string
      calcWithShareValue?: boolean
    }
  }
}

type PropertyType = 'asset' | 'estate'

export const BusinessAssetsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { id, props } = field
  const { assetFields, estateFields } = props

  console.log('application', application)

  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })
  const { setValue, getValues, control } = useFormContext()
  const { formatMessage } = useLocale()

  const [loadingFieldName, setLoadingFieldName] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const calculateTotal = useCallback(() => {
    const values = getValues(id)

    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: any) => {
      const propertyValuation = valueToNumber(current[props.sumField])

      return Number(acc) + propertyValuation
    }, 0)

    const addTotal = id.replace('data', 'total')

    setValue(addTotal, total)
    setTotal(total)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onAdd = (type: PropertyType) => {
    const values = (type === 'asset' ? assetFields : estateFields).map(
      (field: object) => {
        return Object.values(field)[1]
      },
    )

    const repeaterFields: Record<string, string> = values.reduce(
      (acc: Record<string, string>, elem: string) => {
        acc[elem] = ''

        if (elem === 'assetType') {
          acc[elem] = type === 'asset' ? 'asset' : 'estate'
        }
        return acc
      },
      {},
    )

    append(repeaterFields)
  }

  let estateCounter = 0
  let assetCounter = 0

  return (
    <Box>
      {fields.map((repeaterField: any, index) => {
        const fieldIndex = `${id}[${index}]`

        const isAssetType = repeaterField.assetType === 'asset'

        switch (repeaterField.assetType) {
          case 'estate':
            estateCounter++
            break
          case 'asset':
            assetCounter++
            break
          default:
            break
        }

        const customFields = isAssetType ? assetFields : estateFields

        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={() => {
                  remove(index)
                  calculateTotal()
                }}
              />
            </Box>
            <GridRow>
              <GridColumn span="1/1">
                <Text paddingBottom={2} variant="h4">
                  {isAssetType
                    ? `${formatMessage(
                        m.businessAssetRepeaterHeader,
                      )} ${assetCounter}`
                    : `${formatMessage(
                        m.realEstateRepeaterHeader,
                      )} ${estateCounter}`}
                </Text>
              </GridColumn>
              {customFields.map((field: any, index) => {
                // exclude counting the hidden field
                const fieldCount = customFields.length - 1

                const even = fieldCount % 2 === 0
                const pushRight = !even && index === fieldCount

                const fieldName = `${fieldIndex}.${field.id}`
                const error = errors && getErrorViaPath(errors, fieldName)

                if (field.id === 'assetType') {
                  return (
                    <Controller
                      key={index}
                      control={control}
                      defaultValue={repeaterField.assetType}
                      render={() => <input type="hidden" />}
                      name={fieldName}
                    />
                  )
                }

                return (
                  <FieldComponent
                    key={index}
                    onAfterChange={calculateTotal}
                    setLoadingFieldName={(v) => {
                      setLoadingFieldName(v)
                    }}
                    loadingFieldName={loadingFieldName}
                    pushRight={pushRight}
                    fieldIndex={fieldIndex}
                    field={field}
                    fieldName={fieldName}
                    error={error}
                  />
                )
              })}
            </GridRow>
          </Box>
        )
      })}

      <Box marginTop={3}>
        <DropdownMenu
          disclosure={
            <Button
              size="small"
              variant="utility"
              icon="add"
              title={'TODO: Add title'}
            >
              {props.repeaterButtonText}
            </Button>
          }
          // trick to make dropdown close after adding a new item
          key={`dropdown-${fields.length}`}
          items={[
            {
              title: 'Eign',
              onClick: () => onAdd('asset'),
            },
            {
              title: 'Fasteign',
              onClick: () => onAdd('estate'),
            },
          ]}
        />
      </Box>
      {!!fields.length && props.sumField && (
        <Box marginTop={5}>
          <GridRow>
            <DoubleColumnRow
              right={
                <Input
                  id={`${id}.total`}
                  name={`${id}.total`}
                  value={formatCurrency(String(valueToNumber(total)))}
                  label={formatMessage(m.total)}
                  backgroundColor="white"
                  readOnly
                />
              }
            />
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default BusinessAssetsRepeater

interface FieldComponentProps {
  onAfterChange?: () => void
  setLoadingFieldName?: (fieldName: string | null) => void
  loadingFieldName?: string | null
  pushRight?: boolean
  field: Record<string, any>
  fieldIndex: string
  fieldName: string
  error?: string
}

const FieldComponent = ({
  onAfterChange,
  setLoadingFieldName,
  loadingFieldName,
  pushRight,
  field,
  fieldIndex,
  fieldName,
  error,
}: FieldComponentProps) => {
  let content = null

  const defaultProps = {
    id: fieldName,
    name: fieldName,
    format: field.format,
    label: field.title,
    defaultValue: '',
    type: field.type,
    placeholder: field.placeholder,
    backgroundColor: field.color ? field.color : 'blue',
    currency: field.currency,
    readOnly: field.readOnly,
    required: field.required,
    loading: fieldName === loadingFieldName,
    suffix: '',
    onChange: () => onAfterChange?.(),
    error: error,
    ...field,
  }

  switch (field.id) {
    case 'sectionTitle':
      return (
        <GridColumn key={fieldName} span="1/1">
          <Text
            variant={
              field.sectionTitleVariant ? field.sectionTitleVariant : 'h5'
            }
            marginBottom={2}
          >
            {field.sectionTitle}
          </Text>
        </GridColumn>
      )
    case 'assetNumber':
      content = (
        <RealEstateNumberField
          field={field}
          fieldName={fieldName}
          fieldIndex={fieldIndex}
          setLoadingFieldName={setLoadingFieldName}
          {...defaultProps}
        />
      )

      break
    default:
      content = <InputController {...defaultProps} />

      break
  }

  return (
    <DoubleColumnRow
      span={field.width === 'full' ? ['1/1', '1/1'] : ['1/1', '1/2']}
      pushRight={pushRight}
      paddingBottom={2}
      key={fieldName}
    >
      {content}
    </DoubleColumnRow>
  )
}

const RealEstateNumberField = ({
  fieldIndex,
  fieldName,
  error,
  setLoadingFieldName,
  ...props
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()
  const { setValue, clearErrors, setError } = useFormContext()

  const descriptionFieldName = `${fieldIndex}.description`

  const propertyNumberInput = useWatch({
    name: fieldName,
    defaultValue: '',
  })

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          clearErrors(descriptionFieldName)

          setValue(
            descriptionFieldName,
            data.searchForProperty?.defaultAddress?.display ?? '',
          )
        },
        fetchPolicy: 'network-only',
      },
    )

  useEffect(() => {
    setLoadingFieldName?.(queryLoading ? descriptionFieldName : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLoading])

  useEffect(() => {
    const propertyNumber = propertyNumberInput.trim().toUpperCase()

    setValue(descriptionFieldName, '')

    if (isValidRealEstate(propertyNumber)) {
      clearErrors(fieldName)

      getProperty({
        variables: {
          input: {
            propertyNumber,
          },
        },
      })
    } else {
      setError(fieldName, {
        message: formatMessage(m.errorPropertyNumber),
        type: 'validate',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyNumberInput])

  return (
    <InputController
      id={fieldName}
      name={fieldName}
      label={formatMessage(m.propertyNumber)}
      defaultValue={propertyNumberInput}
      error={error ? formatMessage(m.errorPropertyNumber) : undefined}
      {...props}
    />
  )
}
