import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import {
  FC,
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useFormContext } from 'react-hook-form'

import { InputController } from '@island.is/shared/form-fields'
import {
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Answers } from '../../types'
import { NO, YES } from '../../lib/constants'
import { MessageDescriptor } from 'react-intl'
import { SpanType } from '@island.is/island-ui/core/types'
import { valueToNumber } from '../../lib/utils/helpers'

type CustomField = {
  id: string
  title: string
}

type FieldProps = {
  field: {
    props: {
      fields: CustomField[]
    }
  }
}

type RadioNames = 'wasInCohabitation' | 'hadSeparateProperty'

type RadioSelection = {
  name: RadioNames
  title: MessageDescriptor
}

const radioButtons: RadioSelection[] = [
  {
    name: 'wasInCohabitation',
    title: m.wasInCohabitation,
  },
  {
    name: 'hadSeparateProperty',
    title: m.hadSeparateProperty,
  },
]

type YesOrNo = typeof YES | typeof NO

const span: SpanType = ['1/1', '1/1', '1/1', '1/2']

export const SpouseEstateShare: FC<
  PropsWithChildren<FieldBaseProps<Answers> & FieldProps>
> = ({ field, errors }) => {
  const { id } = field

  const { formatMessage } = useLocale()
  const { getValues, setValue, clearErrors } = useFormContext()

  const getUpdatedValues = useCallback(() => getValues(id), [getValues, id])

  const [
    localSpouseTotalSeparateProperty,
    setLocalSpouseTotalSeparateProperty,
  ] = useState<number>(getUpdatedValues()?.spouseTotalSeparateProperty ?? 0)
  const [localSpouseTotalDeduction, setLocalSpouseTotalDeduction] =
    useState<number>(getUpdatedValues()?.spouseTotalDeduction ?? 0)
  const [wasInCohabitation, setWasInCohabitation] = useState<
    YesOrNo | undefined
  >(getUpdatedValues()?.wasInCohabitation ?? undefined)
  const [hadSeparateProperty, setHadSeparateProperty] = useState<
    YesOrNo | undefined
  >(getUpdatedValues()?.hadSeparateProperty ?? undefined)

  const wasInCohabitationField = `${id}.wasInCohabitation`
  const hadSeparatePropertyField = `${id}.hadSeparateProperty`
  const spouseTotalDeductionField = `${id}.spouseTotalDeduction`
  const spouseTotalSeparatePropertyField = `${id}.spouseTotalSeparateProperty`

  const assetsTotal = getValues()?.assets?.assetsTotal ?? 0

  const getError = (field: string): string | undefined => {
    return (
      (errors as { spouse: Record<string, string> })?.spouse?.[field] ??
      undefined
    )
  }

  // TODO: decide on if we want to show this in some cases
  const showSpouseTotalDeduction = false // wasInCohabitation === YES && hadSeparateProperty === NO
  const showSeparateProperty =
    wasInCohabitation === YES && hadSeparateProperty === YES

  const clearHadSeparateProperty = useCallback(() => {
    setHadSeparateProperty(undefined)
    setValue(hadSeparatePropertyField, undefined)
  }, [hadSeparatePropertyField, setValue])

  useEffect(() => {
    if (wasInCohabitation === NO) {
      clearHadSeparateProperty()
    }

    if (wasInCohabitation === YES && hadSeparateProperty === YES) {
      let deduction = assetsTotal * 0.5
      deduction = (localSpouseTotalDeduction - deduction) / 2
      setValue('totalDeduction', deduction > 0 ? deduction : 0)
    }

    if (wasInCohabitation === YES && hadSeparateProperty === NO) {
      const deduction = assetsTotal * 0.5
      setLocalSpouseTotalDeduction(deduction)
      setValue(spouseTotalDeductionField, deduction)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    assetsTotal,
    hadSeparateProperty,
    localSpouseTotalDeduction,
    spouseTotalDeductionField,
    wasInCohabitation,
  ])

  const options: { label: string; value: YesOrNo }[] = [
    { label: formatMessage(m.yes), value: YES },
    { label: formatMessage(m.no), value: NO },
  ]

  return (
    <GridRow>
      {radioButtons.map(({ name, title }) => {
        const fieldName = `${id}.${name}`

        let show = false

        switch (name) {
          case 'wasInCohabitation':
            show = true
            break
          case 'hadSeparateProperty':
            show = wasInCohabitation === YES
            break
          default:
            break
        }

        if (!show) {
          return null
        }

        return (
          <Fragment key={fieldName}>
            <GridColumn span="1/1" paddingBottom={2}>
              <Text variant="h4">{formatMessage(title)}</Text>
            </GridColumn>
            {options.map(({ label, value }, index) => {
              let checked = false

              switch (name) {
                case 'wasInCohabitation':
                  checked = wasInCohabitation === value
                  break
                case 'hadSeparateProperty':
                  checked = hadSeparateProperty === value
                  break
                default:
                  break
              }

              return (
                <GridColumn
                  span="1/2"
                  key={`${name}-${index}`}
                  paddingBottom={4}
                >
                  <RadioButton
                    id={`${fieldName}-${index}`}
                    name={fieldName}
                    value={value}
                    label={label}
                    hasError={!!getError(name)}
                    errorMessage={getError(name)}
                    checked={checked}
                    onChange={() => {
                      clearErrors()

                      switch (name) {
                        case 'wasInCohabitation':
                          setWasInCohabitation(value)
                          setValue(wasInCohabitationField, value)
                          break
                        case 'hadSeparateProperty':
                          setHadSeparateProperty(value)
                          setValue(hadSeparatePropertyField, value)
                          break
                        default:
                          break
                      }
                    }}
                  />
                </GridColumn>
              )
            })}
          </Fragment>
        )
      })}

      {showSpouseTotalDeduction && (
        <Fragment>
          <GridColumn span="1/1">
            <Text paddingBottom={2} variant="h4">
              {formatMessage(m.totalDeduction)}
            </Text>
          </GridColumn>
          <GridColumn span={span}>
            <Input
              id={spouseTotalDeductionField}
              name={spouseTotalDeductionField}
              value={formatCurrency(String(localSpouseTotalDeduction ?? '0'))}
              label={formatMessage(m.deceasedSeparateProperty)}
              backgroundColor="white"
              readOnly
            />
          </GridColumn>
        </Fragment>
      )}

      {showSeparateProperty && (
        <Fragment>
          <GridColumn span="1/1">
            <Text paddingBottom={2} variant="h4">
              {formatMessage(m.totalSeparateProperty)}
            </Text>
          </GridColumn>
          <GridColumn span="1/1">
            <Text paddingBottom={3}>
              {formatMessage(m.totalSeparatePropertyDescription)}
            </Text>
          </GridColumn>
          <GridColumn span={span}>
            <InputController
              id={spouseTotalSeparatePropertyField}
              name={spouseTotalSeparatePropertyField}
              defaultValue={'0'}
              label={formatMessage(m.totalSeparatePropertyLabel)}
              error={getError('spouseTotalSeparateProperty')}
              backgroundColor="blue"
              onChange={(e) => {
                clearErrors()
                const value = e.target.value

                setValue(
                  spouseTotalSeparatePropertyField,
                  valueToNumber(value, ','),
                )
                setLocalSpouseTotalDeduction(valueToNumber(value, ','))
              }}
              currency
            />
          </GridColumn>
        </Fragment>
      )}
    </GridRow>
  )
}

export default SpouseEstateShare
