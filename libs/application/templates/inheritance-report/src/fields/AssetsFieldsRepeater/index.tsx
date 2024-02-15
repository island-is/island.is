/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
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
      fields: Array<object>
      repeaterButtonText: string
      sumField: string
      fromExternalData?: string
      calcWithShareValue?: boolean
    }
  }
}

export const AssetsFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { externalData } = application
  const { id, props } = field

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
      const shareValue = valueToNumber(current?.share)

      return (
        Number(acc) +
        (props?.calcWithShareValue
          ? Math.floor(propertyValuation * (shareValue / 100))
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
    const extData = (externalData.syslumennOnEntry?.data as any).estate[
      props.fromExternalData ? props.fromExternalData : ''
    ]

    if (
      !(application?.answers as any)?.assets?.realEstate?.hasModified &&
      fields.length === 0 &&
      extData.length
    ) {
      replace(extData)
      setValue('assets.realEstate.hasModified', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

export default AssetsFieldsRepeater

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
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  let content = null

  let defaultProps = {
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
        <AsssetNumberField
          field={field}
          fieldName={fieldName}
          fieldIndex={fieldIndex}
          setLoadingFieldName={setLoadingFieldName}
          {...defaultProps}
        />
      )

      break
    case 'share':
      defaultProps = {
        ...defaultProps,
        label: formatMessage(m.propertyShare),
      }

      content = (
        <InputController
          {...defaultProps}
          onChange={(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            const value = valueToNumber(e.target.value)

            if (value >= 0 && value <= 100) {
              onAfterChange?.()
            }

            if (value === 0) {
              setValue(fieldName, '0%')
            }
          }}
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

const AsssetNumberField = ({
  fieldIndex,
  fieldName,
  error,
  setLoadingFieldName,
  ...props
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()
  const { setValue, clearErrors, setError } = useFormContext()

  const addressFieldName = `${fieldIndex}.description`

  const propertyNumberInput = useWatch({
    name: fieldName,
    defaultValue: '',
  })

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          clearErrors(addressFieldName)

          setValue(
            addressFieldName,
            data.searchForProperty?.defaultAddress?.display ?? '',
          )
        },
        fetchPolicy: 'network-only',
      },
    )

  useEffect(() => {
    setLoadingFieldName?.(queryLoading ? addressFieldName : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLoading])

  useEffect(() => {
    const propertyNumber = propertyNumberInput.trim().toUpperCase()

    setValue(addressFieldName, '')

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
