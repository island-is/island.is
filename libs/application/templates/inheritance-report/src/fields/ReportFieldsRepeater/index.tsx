/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
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
import { YES } from '../../lib/constants'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import { getEstateDataFromApplication } from '../../lib/utils/helpers'
import {
  InheritanceReportAsset,
  InheritanceReportInfo,
} from '@island.is/clients/syslumenn'
import { valueToNumber } from '../../lib/utils/helpers'
import NumberInput from '../../components/NumberInput'

type RepeaterProps = {
  field: {
    props: {
      sectionTitle?: string
      sectionTitleVariant?: string
      fields: Array<Record<string, unknown>>
      repeaterButtonText: string
      sumField: string
      sumField2: string
      fromExternalData?: string
      calcWithShareValue?: boolean
      skipPushRight?: boolean
    }
  }
}

const valueKeys = ['exchangeRateOrInterest', 'amount']

export const ReportFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { answers, externalData } = application

  const { id, props } = field

  const { fields, append, remove, replace } = useFieldArray<any>({
    name: id,
  })

  const { setValue, getValues, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  /* ------ Bank accounts and balances ------ */
  const [foreignBankAccountIndexes, setForeignBankAccountIndexes] = useState<
    number[]
  >([])

  /* ------ Stocks ------ */
  const [rateOfExchange, setRateOfExchange] = useState(0)
  const [faceValue, setFaceValue] = useState(0)
  const [index, setIndex] = useState('0')

  /* ------ Total ------ */
  const [total, setTotal] = useState(0)
  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: any, index: number) => {
      const sumField2 = valueToNumber(current[props?.sumField2], ',')
      let currentValue = valueToNumber(current[props?.sumField], ',')
      currentValue = currentValue + sumField2
      const shareValueNumber = valueToNumber(current?.share, '.')

      if (id === 'assets.bankAccounts.data') {
        setValue(`${id}[${index}].bankAccountTotal`, currentValue)
      }

      const shareValue = !shareValueNumber ? 0 : shareValueNumber / 100

      return (
        Number(acc) +
        (props?.calcWithShareValue
          ? Math.round(currentValue * shareValue)
          : currentValue)
      )
    }, 0)

    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total)

    setTotal(total)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, id, props.sumField])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const relations =
    (externalData.syslumennOnEntry?.data as any).relationOptions?.map(
      (relation: any) => ({
        value: relation,
        label: relation,
      }),
    ) || []

  const handleAddRepeaterFields = () => {
    //reset stocks
    setRateOfExchange(0)
    setFaceValue(0)

    const values = props.fields.map((field: object) => {
      return Object.values(field)[1]
    })

    const repeaterFields: Record<string, string> = values.reduce(
      (acc: Record<string, unknown>, elem: string) => {
        if (elem === 'foreignBankAccount') {
          acc[elem] = []
        } else {
          acc[elem] = ''
        }

        return acc
      },
      {},
    )

    append(repeaterFields)
  }

  const updateValue = (
    fieldIndex: string,
    explicitAVal = '0',
    explicitBVal = '0',
  ) => {
    const stockValues: { amount?: string; exchangeRateOrInterest?: string } =
      getValues(fieldIndex)

    const faceValue = stockValues?.amount
    const rateOfExchange = stockValues?.exchangeRateOrInterest

    const a = faceValue?.replace(/[^\d.]/g, '') || explicitAVal
    const b = rateOfExchange?.replace(/[^\d.]/g, '') || explicitBVal

    const aVal = parseFloat(a)
    const bVal = parseFloat(b)

    if (!aVal || !bVal) {
      setValue(`${fieldIndex}.value`, '')
      calculateTotal()
      return
    }

    const total = aVal * bVal
    const totalString = total.toFixed(0)

    setValue(`${fieldIndex}.value`, totalString)

    if (total > 0) {
      clearErrors(`${fieldIndex}.value`)
    }

    calculateTotal()
  }

  /* ------ Set stocks value and total ------ */
  useEffect(() => {
    if (rateOfExchange > 0 && faceValue > 0) {
      setValue(`${index}.value`, String(faceValue * rateOfExchange))

      calculateTotal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceValue, index, rateOfExchange, setValue])

  /* ------ Set fields from external data (realEstate, vehicles) ------ */
  useEffect(() => {
    const estateData =
      getEstateDataFromApplication(application).inheritanceReportInfo
    const extData: Array<InheritanceReportAsset> =
      estateData && props.fromExternalData
        ? (estateData[
            props.fromExternalData as keyof InheritanceReportInfo
          ] as InheritanceReportAsset[])
        : []

    if (
      extData.length &&
      !(application?.answers as any)?.modifiers?.[props?.fromExternalData ?? '']
        ?.hasModified &&
      fields.length === 0
    ) {
      replace(extData)
      setValue(`modifiers.${props?.fromExternalData}.hasModified`, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const indexes = fields.reduce<number[]>((acc, _, index) => {
      const fieldData: { foreignBankAccount?: string[] }[] | undefined =
        getValueViaPath(answers, id)

      const isForeignBankAccount =
        fieldData?.[index]?.foreignBankAccount?.includes(YES)

      if (isForeignBankAccount) {
        acc.push(index)
      }

      return acc
    }, [])

    setForeignBankAccountIndexes(indexes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // The `fields` variable is an empty array at this point
    // but if we, however, construct the field ids manually the
    // getValues function will still return their values
    if (props?.fromExternalData === 'stocks') {
      let itemIndex = 0
      // Since there are not an infinite amount of fields
      // this while(values) loop will terminate when the itemIndex
      // goes out of bounds (resulting in getValues → undefined)
      const values = {}
      while (values) {
        const fieldIndex = `${id}[${itemIndex}]`
        const values = getValues(fieldIndex)

        if (values) {
          updateValue(
            fieldIndex,
            values.amount as string,
            values.exchangeRateOrInterest as string,
          )
        } else {
          break
        }
        itemIndex += 1
      }
    }
  }, [])

  return (
    <Box>
      {fields.map((repeaterField: any, mainIndex) => {
        const fieldIndex = `${id}[${mainIndex}]`

        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={() => {
                  remove(mainIndex)
                  calculateTotal()
                }}
              />
            </Box>
            <GridRow>
              {props.fields.map((field: any, index) => {
                const even = props.fields.length % 2 === 0
                const lastIndex = props.fields.length - 1

                const skipPushRight = props?.skipPushRight === true
                const pushRight = !skipPushRight && !even && index === lastIndex

                const fieldId = `${fieldIndex}.${field.id}`
                const err = errors && getErrorViaPath(errors, fieldId)

                const shouldRecalculateTotal =
                  props.sumField === field.id || props.sumField2 === field.id

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
                      {formatMessage(field.sectionTitle)}
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
                    {field.id === 'foreignBankAccount' ? (
                      <CheckboxController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={[]}
                        options={[
                          {
                            label: formatMessage(m.bankAccountForeignLabel),
                            value: YES,
                          },
                        ]}
                        onSelect={(val) => {
                          setValue(`${fieldIndex}.${field.id}`, val)

                          setForeignBankAccountIndexes(
                            val.length
                              ? [...foreignBankAccountIndexes, mainIndex]
                              : foreignBankAccountIndexes.filter(
                                  (i) => i !== mainIndex,
                                ),
                          )
                        }}
                      />
                    ) : field.id === 'accountNumber' ? (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        label={formatMessage(m.bankAccount)}
                        backgroundColor="blue"
                        {...(!foreignBankAccountIndexes.includes(mainIndex) && {
                          format: '####-##-######',
                          placeholder: '0000-00-000000',
                        })}
                        error={err}
                        required
                      />
                    ) : field.id === 'share' ? (
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
                    ) : field.id === 'relation' ? (
                      <SelectController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        label={formatMessage(field.title) ?? ''}
                        placeholder={field.placeholder}
                        options={relations}
                      />
                    ) : field.id === 'exchangeRateOrInterest' ? (
                      <NumberInput
                        name={`${fieldIndex}.${field.id}`}
                        placeholder={field.placeholder}
                        onAfterChange={() => {
                          updateValue(fieldIndex)
                          calculateTotal()
                          setIndex(fieldIndex)
                        }}
                        label={formatMessage(field.title) ?? ''}
                      />
                    ) : (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={
                          repeaterField[field.id] ? repeaterField[field.id] : ''
                        }
                        format={field.format}
                        label={formatMessage(field.title)}
                        placeholder={field.placeholder}
                        backgroundColor={field.color ? field.color : 'blue'}
                        currency={field.currency}
                        readOnly={field.readOnly}
                        type={field.type}
                        textarea={field.variant}
                        rows={field.rows}
                        required={field.required}
                        error={err}
                        onChange={() => {
                          if (valueKeys.includes(field.id)) {
                            updateValue(fieldIndex)
                          }

                          if (shouldRecalculateTotal) {
                            calculateTotal()
                          }

                          setIndex(fieldIndex)
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
          {formatMessage(props.repeaterButtonText)}
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
                />
              }
            />
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default ReportFieldsRepeater
