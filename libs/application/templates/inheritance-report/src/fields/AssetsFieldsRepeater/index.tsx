/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FC,
  useState,
  useEffect,
  useCallback,
  Fragment,
  ReactNode,
  ChangeEvent,
} from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
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
  GridColumnProps,
} from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'
import { getErrorViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

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

  const { setValue, getValues, watch, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          // clearErrors(addressField)
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

    // setValue(addressField, '')
    if (isValidRealEstate(propertyNumber)) {
      // clearErrors(propertyNumberField)
      getProperty({
        variables: {
          input: {
            propertyNumber,
          },
        },
      })
    } else {
      // setError(propertyNumberField, {
      //   message: formatMessage(m.errorPropertyNumber),
      //   type: 'validate',
      // })
    }
  }, [getProperty, setValue])

  /* ------ Total ------ */
  const [total, setTotal] = useState(0)
  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: any) => {
      const propertyValuationNumber = parseInt(current[props.sumField], 10)
      const shareValueNumber = parseInt(current?.propertyShare, 10)

      const propertyValuation = isNaN(propertyValuationNumber)
        ? 0
        : propertyValuationNumber
      const shareValue = isNaN(shareValueNumber) ? 0 : shareValueNumber / 100

      // TODO: check how precise are these calculations need to be
      return (
        Number(acc) +
        (props?.calcWithShareValue
          ? Math.floor(propertyValuation * shareValue)
          : propertyValuation)
      )
    }, 0)
    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total)

    setTotal(total)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, id, props.sumField])

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
        return acc
      },
      {},
    )

    append(repeaterFields)
  }

  /* ------ Set fields from external data (realEstate, vehicles) ------ */
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

                const fieldId = `${fieldIndex}.${field.id}`
                const err = errors && getErrorViaPath(errors, fieldId)

                const propertyNumberField = `${fieldIndex}.assetNumber`
                const propertyNumberInput = watch(propertyNumberField, '')

                return field?.sectionTitle ? (
                  <GridColumn key={field.id} span="1/1">
                    <Text
                      variant={
                        field.sectionTitleVariant
                          ? field.sectionTitleVariant
                          : 'h5'
                      }
                      marginBottom={2}
                    >
                      {field.sectionTitle}
                    </Text>
                  </GridColumn>
                ) : (
                  <DoubleColumnRow
                    span={
                      field.width === 'full' ? ['1/1', '1/1'] : ['1/1', '1/2']
                    }
                    pushRight={pushRight}
                    paddingBottom={2}
                    key={field.id}
                  >
                    {field.id === 'propertyShare' ? (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        label={formatMessage(m.propertyShare)}
                        defaultValue="0"
                        backgroundColor="blue"
                        onChange={(
                          e: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >,
                        ) => {
                          const num = parseInt(e.target.value, 10)
                          const value = isNaN(num) ? 0 : num

                          if (value >= 0 && value <= 100) {
                            calculateTotal()
                          }
                        }}
                        error={err}
                        type="number"
                        suffix="%"
                        required
                      />
                    ) : field.id === 'assetNumber' ? (
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
                    ) : (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={
                          repeaterField[field.id] ? repeaterField[field.id] : ''
                        }
                        format={field.format}
                        label={field.title}
                        placeholder={field.placeholder}
                        backgroundColor={field.color ? field.color : 'blue'}
                        currency={field.currency}
                        readOnly={field.readOnly}
                        type={field.type}
                        textarea={field.variant}
                        rows={field.rows}
                        required={field.required}
                        error={err}
                        onChange={(_) => {
                          // const value = elem.target.value.replace(/\D/g, '')

                          // if (props.sumField === field.id) {
                          calculateTotal()
                          // }
                        }}
                      />
                    )}
                  </DoubleColumnRow>
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
                  value={formatCurrency(String(isNaN(total) ? 0 : total))}
                  label={formatMessage(m.total)}
                  backgroundColor="white"
                  readOnly
                  // hasError={error}
                  errorMessage={formatMessage(m.totalPercentageError)}
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

const DoubleColumnRow = ({
  left,
  right,
  pushRight,
  span = ['1/1', '1/2'],
  bypass,
  children,
  ...props
}: {
  left?: ReactNode
  right?: ReactNode
  pushRight?: boolean
  bypass?: boolean
  children?: ReactNode
} & GridColumnProps) => {
  const onlyLeft = left && !right
  const onlyRight = right && !left

  if (children && pushRight) {
    return (
      <Fragment>
        <GridColumn hiddenBelow="sm" span={span} {...props} />
        <GridColumn span={span} {...props}>
          {children}
        </GridColumn>
      </Fragment>
    )
  }

  if (!left && !right && children) {
    return (
      <GridColumn span={span} {...props}>
        {children}
      </GridColumn>
    )
  }

  return onlyLeft ? (
    <Fragment>
      <GridColumn span={span} {...props}>
        {left}
      </GridColumn>
      <GridColumn hiddenBelow="sm" span={span} {...props} />
    </Fragment>
  ) : onlyRight ? (
    <Fragment>
      <GridColumn hiddenBelow="sm" span={span} {...props} />
      <GridColumn span={span} {...props}>
        {right}
      </GridColumn>
    </Fragment>
  ) : (
    <Fragment>
      <GridColumn span={span} {...props}>
        {left}
      </GridColumn>
      <GridColumn span={span} {...props}>
        {right}
      </GridColumn>
    </Fragment>
  )
}
