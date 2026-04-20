import { FC, useState, useEffect, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridRow, Button, Input } from '@island.is/island-ui/core'
import { Answers } from '../../types'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import {
  getEstateDataFromApplication,
  valueToNumber,
  getDeceasedWasMarriedAndHadAssets,
} from '../../lib/utils/helpers'
import { InheritanceReportAsset } from '@island.is/clients/syslumenn'
import DeceasedShare from '../../components/DeceasedShare'
import { PREPAID_INHERITANCE } from '../../lib/constants'
import { FieldComponent } from './FieldComponent'
import { RepeaterProps } from './types'

export const EstateAndVehiclesRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & RepeaterProps>
> = ({ application, field, errors }) => {
  const { id, props } = field
  const { calcWithShareValue, assetKey } = props

  const deceasedHadAssets = getDeceasedWasMarriedAndHadAssets(application)

  if (typeof calcWithShareValue !== 'boolean' || !assetKey) {
    throw new Error('calcWithShareValue and assetKey are required')
  }

  const { fields, append, remove, replace, update } = useFieldArray<any>({
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
      const propertyValuation = valueToNumber(
        current.enabled ? current[props.sumField] : 0,
      )
      const shareValue = valueToNumber(current?.share, '.')

      return (
        Number(acc) +
        (calcWithShareValue
          ? Math.round(propertyValuation * (shareValue / 100))
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
  }, [fields, calculateTotal])

  const handleAddRepeaterFields = () => {
    const values = props.fields.map((field: object) => {
      return Object.values(field)[1]
    })

    // All additional fields should be enabled by default
    values.push('enabled')

    const repeaterFields = Object.fromEntries(
      values.map((elem) => [
        elem,
        elem === 'share' ? '0' : elem === 'enabled' ? true : '',
      ]),
    )

    append(repeaterFields)
  }

  useEffect(() => {
    const estData =
      application.answers.applicationFor === PREPAID_INHERITANCE
        ? {}
        : getEstateDataFromApplication(application)?.inheritanceReportInfo ?? {}

    const extData =
      getValueViaPath<InheritanceReportAsset[]>(estData, assetKey) ?? []

    if (
      !(application?.answers as any)?.assets?.[assetKey]?.hasModified &&
      fields.length === 0 &&
      extData.length
    ) {
      replace(
        extData.map((x) => ({
          ...x,
          share: String(x.share),
          initial: true,
          enabled: true,
        })),
      )
      setValue(`assets.${assetKey}.hasModified`, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetKey])

  let shouldPushRight = false

  const handleClick = (field: any, index: number) => {
    if (field.initial) {
      const updatedField = {
        ...field,
        enabled: !field.enabled,
      }
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
            <Box display={'flex'} justifyContent="flexEnd" marginBottom={2}>
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
                const pushRight = !even && index === lastIndex

                const fieldName = `${fieldIndex}.${field.id}`
                const error = errors && getErrorViaPath(errors, fieldName)

                shouldPushRight = pushRight

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
                    answers={application.answers}
                    isInitial={repeaterField.initial}
                    disabled={!repeaterField.enabled}
                  />
                )
              })}
            </GridRow>
            {deceasedHadAssets && (
              <DeceasedShare
                pushRight={shouldPushRight}
                paddingBottom={2}
                id={fieldIndex}
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

export default EstateAndVehiclesRepeater
