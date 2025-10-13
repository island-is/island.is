/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridRow, Button, Input } from '@island.is/island-ui/core'
import { Answers } from '../../types'
import {
  YES,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PREPAID_INHERITANCE } from '../../lib/constants'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import {
  getDeceasedWasMarriedAndHadAssets,
  getEstateDataFromApplication,
  parseDebtType,
  parseLabel,
} from '../../lib/utils/helpers'
import {
  InheritanceReportAsset,
  InheritanceReportInfo,
} from '@island.is/clients/syslumenn'
import { valueToNumber } from '../../lib/utils/helpers'
import DeceasedShare from '../../components/DeceasedShare'

type RepeaterProps = {
  field: {
    props: {
      fields: Array<Record<string, unknown>>
      repeaterButtonText: string
      sumField: string
      sumField2: string
      fromExternalData?: string
      calcWithShareValue?: boolean
      hideDeceasedShare?: boolean
      skipPushRight?: boolean
      assetKey?: string
      selections?: Array<{ value: string; label: string }>
    }
  }
}

const valueKeys = ['exchangeRateOrInterest', 'amount']

export const ReportFieldsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { answers } = application

  const { id, props } = field

  const deceasedHadAssets = getDeceasedWasMarriedAndHadAssets(application)

  const { fields, append, remove, replace, update } = useFieldArray<any>({
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
      const sumField2 = current.enabled
        ? valueToNumber(current[props?.sumField2], ',')
        : 0
      let currentValue = valueToNumber(
        current.enabled ? current[props?.sumField] : 0,
        ',',
      )
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
  }, [fields, calculateTotal])

  const debtTypes = props.selections ?? []

  const handleAddRepeaterFields = () => {
    //reset stocks
    setRateOfExchange(0)
    setFaceValue(0)

    const values = props.fields.map((field: object) => {
      return Object.values(field)[1]
    })
    // All additional fields should be enabled by default
    values.push('enabled')

    const repeaterFields = Object.fromEntries(
      values.map((elem) => [
        elem,
        elem === 'enabled' ? true : elem === 'foreignBankAccount' ? [] : '',
      ]),
    )

    append(repeaterFields)
  }

  const updateValue = (
    fieldIndex: string,
    explicitAVal = '0',
    explicitBVal = '0',
  ) => {
    const stockValues: {
      amount?: string
      exchangeRateOrInterest?: string
    } = getValues(fieldIndex)

    const faceValue = stockValues?.amount
    const rateOfExchange = stockValues?.exchangeRateOrInterest

    const a = faceValue?.replace(',', '.') || explicitAVal
    const b = rateOfExchange?.replace(',', '.') || explicitBVal

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

  /* ------ Set fields from external data ------ */
  useEffect(() => {
    const estateData =
      answers.applicationFor === PREPAID_INHERITANCE
        ? undefined
        : getEstateDataFromApplication(application).inheritanceReportInfo
    const extData: Array<InheritanceReportAsset> =
      estateData && props.fromExternalData
        ? (
            estateData[
              props.fromExternalData as keyof InheritanceReportInfo
            ] as InheritanceReportAsset[]
          ).map((data: any) => {
            return {
              ...data,
              debtType: parseDebtType(data.debtType ?? ''),
              initial: true,
              enabled: true,
            }
          }) ?? []
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let shouldPushRight = false

  const handleClick = (field: any, index: number) => {
    if (field.initial) {
      const updatedField = {
        ...field,
        enabled: !field.enabled,
      }
      clearErrors(`${id}[${index}]`)
      update(index, updatedField)
    } else {
      remove(index)
    }
    calculateTotal()
  }

  return (
    <Box>
      {fields.map((repeaterField: any, mainIndex) => {
        const fieldIndex = `${id}[${mainIndex}]`
        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
              <Button
                variant="text"
                size="small"
                icon={
                  repeaterField.initial
                    ? repeaterField.enabled
                      ? 'remove'
                      : 'add'
                    : 'trash'
                }
                onClick={() => handleClick(repeaterField, mainIndex)}
              >
                {repeaterField.initial
                  ? repeaterField.enabled
                    ? formatMessage(m.inheritanceDisableMember)
                    : formatMessage(m.inheritanceEnableMember)
                  : formatMessage(m.inheritanceDeleteMember)}
              </Button>
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

                shouldPushRight = pushRight

                if (
                  field.condition &&
                  !field.condition(application.answers.applicationFor)
                ) {
                  if (field.id === 'exchangeRateOrInterest') {
                    setValue(`${fieldIndex}.${field.id}`, '0')
                  }
                  return null
                }
                return (
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
                        spacing={0}
                        disabled={!repeaterField.enabled}
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
                    ) : field.type !== 'nationalId' &&
                      field.id === 'assetNumber' &&
                      props?.assetKey === 'bankAccounts' ? (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        label={formatMessage(field.title)}
                        backgroundColor="blue"
                        {...(!foreignBankAccountIndexes.includes(mainIndex) && {
                          format: '####-##-######',
                          placeholder: '0000-00-000000',
                        })}
                        error={err}
                        disabled={!repeaterField.enabled}
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
                        disabled={!repeaterField.enabled}
                        required
                      />
                    ) : field.id === 'debtType' ? (
                      <SelectController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        label={
                          formatMessage(
                            parseLabel(field.title, application.answers),
                          ) ?? ''
                        }
                        placeholder={field.placeholder}
                        options={debtTypes.map((type) => ({
                          label: formatMessage(type.label),
                          value: type.label,
                        }))}
                        backgroundColor="blue"
                        disabled={!repeaterField.enabled}
                        error={err}
                      />
                    ) : (
                      <InputController
                        id={`${fieldIndex}.${field.id}`}
                        name={`${fieldIndex}.${field.id}`}
                        defaultValue={
                          repeaterField[field.id] ? repeaterField[field.id] : ''
                        }
                        format={field.format}
                        label={formatMessage(
                          parseLabel(field.title, application.answers),
                        )}
                        placeholder={field.placeholder}
                        backgroundColor={field.color ? field.color : 'blue'}
                        currency={field.currency}
                        readOnly={field.readOnly}
                        type={field.type !== 'nationalId' ? field.type : 'text'}
                        textarea={field.variant}
                        rows={field.rows}
                        required={field.required}
                        error={err}
                        disabled={!repeaterField.enabled}
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
            {!props?.hideDeceasedShare && deceasedHadAssets && (
              <DeceasedShare
                id={fieldIndex}
                paddingBottom={2}
                pushRight={shouldPushRight}
                disabled={!repeaterField.enabled}
              />
            )}
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
