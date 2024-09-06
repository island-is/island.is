import { FieldBaseProps } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import {
  FC,
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
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
import { YES } from '@island.is/application/core'

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
> = ({ field, errors }) => {
  const { id, props } = field

  const otherField = `${id}.other`
  const otherDetailsField = `${id}.otherDetails`
  const totalField = `${id}.total`

  const refs = useRef<Array<HTMLInputElement | HTMLTextAreaElement | null>>([])
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
      setValue(otherField, '')
      setValue(otherDetailsField, '')
    }

    calculateTotal()
  }, [calculateTotal, hasOther, id, otherDetailsField, otherField, setValue])

  useEffect(() => {
    const items = refs?.current ?? []

    const setItemValue = (e: Event, field: string, value: string) => {
      const target = e.target as HTMLInputElement
      const targetValue = valueToNumber(target?.value)

      if (!targetValue) {
        setValue(field, value)
      }
    }

    items.forEach((item, index) => {
      const field = `${id}.${props?.fields[index].id}`
      item?.addEventListener('blur', (e) => setItemValue(e, field, '0'))
      item?.addEventListener('focus', (e) => setItemValue(e, field, ''))
    })

    return () => {
      items.forEach((item, index) => {
        const field = `${id}.${props?.fields[index].id}`
        item?.removeEventListener('blur', (e) => setItemValue(e, field, '0'))
        item?.removeEventListener('focus', (e) => setItemValue(e, field, ''))
      })
    }
  }, [id, props?.fields, setValue])

  return (
    <GridRow>
      {(props?.fields ?? []).map((currentField, index) => {
        const fieldName = `${id}.${currentField.id}`

        return (
          <GridColumn key={index} span={['1/1', '1/2']}>
            <Box marginBottom={2}>
              <InputController
                id={fieldName}
                name={fieldName}
                defaultValue="0"
                label={formatMessage(currentField.title)}
                error={getError(currentField.id)}
                ref={(ref) => {
                  refs.current[index] = ref
                }}
                backgroundColor="blue"
                onChange={(e) => {
                  if (!e.target.value) {
                    setValue(fieldName, '0')
                  }

                  calculateTotal()
                }}
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
            <Box marginBottom={2}>
              <InputController
                id={otherField}
                name={otherField}
                defaultValue="0"
                label={formatMessage(m.funeralOtherCost)}
                error={getError('other')}
                backgroundColor="blue"
                onChange={(e) => {
                  if (!e.target.value) {
                    setValue(otherField, '0')
                  }

                  calculateTotal()
                }}
                required
                currency
              />
            </Box>
          </GridColumn>
          <GridColumn span="1/1">
            <Box marginBottom={2}>
              <InputController
                id={otherDetailsField}
                name={otherDetailsField}
                defaultValue=""
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
