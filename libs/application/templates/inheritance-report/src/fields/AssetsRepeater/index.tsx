/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, useCallback } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { GET_VEHICLE_QUERY, SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import {
  GetVehicleInput,
  Query,
  SearchForPropertyInput,
} from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import { isValidRealEstate, valueToNumber } from '../../lib/utils/helpers'
import ShareInput from '../../components/ShareInput'

type RepeaterProps = {
  field: {
    props: {
      sectionTitle?: string
      sectionTitleVariant?: string
      fields: Array<object>
      repeaterButtonText: string
      sumField: string
      fromExternalData?: string
      calcWithShareValue?: boolean
      assetKey?: string
    }
  }
}

export const AssetsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { externalData } = application
  const { id, props } = field
  const { calcWithShareValue, assetKey, fromExternalData } = props

  if (typeof calcWithShareValue !== 'boolean' || !assetKey) {
    throw new Error('calcWithShareValue and assetKey are required')
  }

  const { fields, append, remove, replace } = useFieldArray<any>({
    name: id,
  })
  const { setValue, getValues } = useFormContext()
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
      const shareValue = valueToNumber(current?.share, '.')

      return (
        Number(acc) +
        (calcWithShareValue
          ? // TODO?: might need to fix the total value to support decimals
            Math.round(propertyValuation * (shareValue / 100))
          : propertyValuation)
      )
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

  const handleAddRepeaterFields = () => {
    const values = props.fields.map((field: object) => {
      return Object.values(field)[1]
    })

    const repeaterFields: Record<string, string> = values.reduce(
      (acc: Record<string, string>, elem: string) => {
        acc[elem] = ''

        if (elem === 'share') {
          acc[elem] = '100'
        }

        return acc
      },
      {},
    )

    append(repeaterFields)
  }

  useEffect(() => {
    const extData = getValueViaPath(
      (externalData.syslumennOnEntry?.data as any).estate,
      fromExternalData ?? '',
    ) as Record<string, unknown>[]

    if (
      !(application?.answers as any)?.assets?.[assetKey]?.hasModified &&
      fields.length === 0 &&
      extData.length
    ) {
      replace(
        extData.map((x) => ({
          ...x,
          share: '0',
        })),
      )
      setValue(`assets.${assetKey}.hasModified`, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetKey])

  return (
    <Box>
      {fields.map((repeaterField: any, index) => {
        const fieldIndex = `${id}[${index}]`

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
              {props.fields.map((field: any, index) => {
                const even = props.fields.length % 2 === 0
                const lastIndex = props.fields.length - 1
                const pushRight = !even && index === lastIndex

                const fieldName = `${fieldIndex}.${field.id}`
                const error = errors && getErrorViaPath(errors, fieldName)

                return (
                  <FieldComponent
                    key={index}
                    assetKey={assetKey}
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
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddRepeaterFields}
          size="small"
        >
          {props.repeaterButtonText}
        </Button>
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

export default AssetsRepeater

interface FieldComponentProps {
  assetKey?: string
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
  assetKey,
  onAfterChange,
  setLoadingFieldName,
  loadingFieldName,
  pushRight,
  field,
  fieldIndex,
  fieldName,
  error,
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()
  const { control, watch } = useFormContext()

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
      if (assetKey === 'realEstate') {
        content = (
          <RealEstateNumberField
            field={field}
            fieldName={fieldName}
            fieldIndex={fieldIndex}
            setLoadingFieldName={setLoadingFieldName}
            {...defaultProps}
          />
        )
      } else if (assetKey === 'vehicles') {
        content = (
          <VehicleNumberField
            field={field}
            fieldName={fieldName}
            fieldIndex={fieldIndex}
            setLoadingFieldName={setLoadingFieldName}
            {...defaultProps}
          />
        )
      }

      break
    case 'share':
      content = (
        <ShareInput
          control={control}
          name={fieldName}
          label={formatMessage(m.propertyShare)}
          value={watch(fieldName)}
          onAfterChange={onAfterChange}
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

const VehicleNumberField = ({
  fieldIndex,
  fieldName,
  error,
  setLoadingFieldName,
  ...props
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()
  const { setValue, clearErrors } = useFormContext()

  const descriptionFieldName = `${fieldIndex}.description`

  const assetNumberInput = useWatch({
    name: fieldName,
    defaultValue: '',
  })

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: GetVehicleInput }>(GET_VEHICLE_QUERY, {
      onError: (_e) => {
        setValue(descriptionFieldName, '')
      },
      onCompleted: (data) => {
        const carName =
          `${data?.syslumennGetVehicle?.manufacturer} ${data.syslumennGetVehicle?.modelName}`.trim()
        if (
          carName.length === 0 ||
          carName.startsWith('null') ||
          carName.endsWith('null')
        ) {
          setValue(descriptionFieldName, '')
          return
        }
        clearErrors(descriptionFieldName)
        setValue(descriptionFieldName, carName)
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    setLoadingFieldName?.(queryLoading ? descriptionFieldName : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLoading])

  useEffect(() => {
    if (assetNumberInput.trim().length > 0) {
      getProperty({
        variables: {
          input: {
            vehicleId: assetNumberInput.trim().toUpperCase(),
          },
        },
      })
    } else {
      setValue(descriptionFieldName, '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetNumberInput])

  return (
    <span className={styles.uppercase}>
      <InputController
        id={fieldName}
        name={fieldName}
        label={formatMessage(m.propertyNumber)}
        defaultValue={assetNumberInput}
        error={error ? formatMessage(m.errorPropertyNumber) : undefined}
        {...props}
      />
    </span>
  )
}
