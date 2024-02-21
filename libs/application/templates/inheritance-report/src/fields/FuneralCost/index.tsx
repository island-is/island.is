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

import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { valueToNumber } from '../../lib/utils/helpers'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import { m } from '../../lib/messages'
import { Answers } from '../../types'
import { YES } from '../../lib/constants'

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

export const FuneralCost: FC<
  PropsWithChildren<FieldBaseProps<Answers> & FieldProps>
> = ({ field }) => {
  const { id, props } = field

  const totalField = `${id}.total`

  const { formatMessage } = useLocale()
  const { getValues, setValue } = useFormContext()

  const getUpdatedValues = useCallback(() => getValues(id), [getValues, id])

  const [hasOther, setHasOther] = useState(
    getUpdatedValues()?.hasOther?.length > 0,
  )

  const calculateTotal = useCallback(() => {
    console.log('calculateTotal hasOther', hasOther)

    const values = getUpdatedValues()

    const buildCost = valueToNumber(values?.build)
    const cremationCost = valueToNumber(values?.cremation)
    const printCost = valueToNumber(values?.print)
    const flowersCost = valueToNumber(values?.flowers)
    const musicCost = valueToNumber(values?.music)
    const rentCost = valueToNumber(values?.rent)
    const foodCost = valueToNumber(values?.food)
    const tombstoneCost = valueToNumber(values?.tombstone)

    let total =
      buildCost +
      cremationCost +
      printCost +
      flowersCost +
      musicCost +
      rentCost +
      foodCost +
      tombstoneCost

    if (hasOther) {
      total += valueToNumber(values?.other)
    }

    setValue(totalField, String(total ?? '0'))
  }, [getUpdatedValues, hasOther, setValue, totalField])

  useEffect(() => {
    if (!hasOther) {
      setValue(`${id}.other`, '')
      setValue(`${id}.otherDetails`, '')
    }

    calculateTotal()
  }, [calculateTotal, hasOther, id, setValue])

  console.log(getUpdatedValues()?.total)

  return (
    <GridRow>
      {(props?.fields ?? []).map((currentField, index) => {
        const fieldName = `${id}.${currentField.id}`

        return (
          <GridColumn key={index} span={['1/1', '1/2']}>
            <InputController
              id={fieldName}
              name={fieldName}
              label={formatMessage(currentField.title)}
              backgroundColor="blue"
              onChange={() => {
                calculateTotal()
              }}
              currency
            />
          </GridColumn>
        )
      })}
      <GridColumn span="1/1">
        <CheckboxController
          id={`${id}.hasOther`}
          options={[
            {
              label: formatMessage(m.funeralOtherCostQuestion),
              value: YES,
            },
          ]}
          onSelect={(value) => {
            setHasOther(value.length > 0)
            calculateTotal()
          }}
        />
      </GridColumn>
      {hasOther && (
        <Fragment>
          <GridColumn span="1/1">
            <InputController
              id={`${id}.other`}
              name={`${id}.other`}
              label={formatMessage(m.funeralOtherCost)}
              backgroundColor="blue"
              onChange={() => {
                calculateTotal()
              }}
              required
              currency
            />
          </GridColumn>
          <GridColumn span="1/1">
            <InputController
              id={`${id}.otherDetails`}
              name={`${id}.otherDetails`}
              rows={4}
              label={formatMessage(m.funeralOtherCostDetails)}
              backgroundColor="blue"
              required
              textarea
            />
          </GridColumn>
        </Fragment>
      )}
      <DoubleColumnRow pushRight>
        <InputController
          id={totalField}
          name={totalField}
          format={(value: unknown) => formatCurrency(String(value))}
          label={formatMessage(m.funeralCostAmount)}
          backgroundColor="white"
          readOnly
        />
      </DoubleColumnRow>
    </GridRow>
  )
}

export default FuneralCost
