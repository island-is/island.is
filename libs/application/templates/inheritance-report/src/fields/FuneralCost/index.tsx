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
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
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

const MARGIN_BOTTOM = 2

export const FuneralCost: FC<
  PropsWithChildren<FieldBaseProps<Answers> & FieldProps>
> = ({ field, errors }) => {
  const { id, props } = field

  const totalField = `${id}.total`

  const { formatMessage } = useLocale()
  const { getValues, setValue, clearErrors } = useFormContext()

  const getUpdatedValues = useCallback(() => getValues(id), [getValues, id])

  const [hasOther, setHasOther] = useState(
    getUpdatedValues()?.hasOther?.length > 0,
  )

  const getError = (field: string): string | undefined => {
    return (
      (errors as { funeralCost: Record<string, string> })?.funeralCost?.[
        field
      ] ?? undefined
    )
  }

  const calculateTotal = useCallback(() => {
    clearErrors()

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
  }, [clearErrors, getUpdatedValues, hasOther, setValue, totalField])

  useEffect(() => {
    if (!hasOther) {
      setValue(`${id}.other`, '')
      setValue(`${id}.otherDetails`, '')
    }

    calculateTotal()
  }, [calculateTotal, hasOther, id, setValue])

  return (
    <GridRow>
      {(props?.fields ?? []).map((currentField, index) => {
        const fieldName = `${id}.${currentField.id}`

        return (
          <GridColumn key={index} span={['1/1', '1/2']}>
            <Box marginBottom={MARGIN_BOTTOM}>
              <InputController
                id={fieldName}
                name={fieldName}
                label={formatMessage(currentField.title)}
                error={getError(currentField.id)}
                backgroundColor="blue"
                onChange={() => {
                  calculateTotal()
                }}
                required
                currency
              />
            </Box>
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
            <Box marginBottom={MARGIN_BOTTOM}>
              <InputController
                id={`${id}.other`}
                name={`${id}.other`}
                label={formatMessage(m.funeralOtherCost)}
                error={getError('other')}
                backgroundColor="blue"
                onChange={() => {
                  calculateTotal()
                }}
                required
                currency
              />
            </Box>
          </GridColumn>
          <GridColumn span="1/1">
            <Box marginBottom={MARGIN_BOTTOM}>
              <InputController
                id={`${id}.otherDetails`}
                name={`${id}.otherDetails`}
                rows={4}
                label={formatMessage(m.funeralOtherCostDetails)}
                error={getError('otherDetails')}
                backgroundColor="blue"
                required
                textarea
              />
            </Box>
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
