import { FC, useEffect, useCallback, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
  Input,
} from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'

import { m } from '../../lib/messages'
import { AdditionalRealEstate } from './AdditionalRealEstate'
import { InputController } from '@island.is/shared/form-fields'
import { getEstateDataFromApplication, valueToNumber } from '../../lib/utils'
import { formatCurrency } from '@island.is/application/ui-components'
import DoubleColumnRow from '../DoubleColumnRow'

export const RealEstateRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, errors }) => {
  const error = (errors as ErrorValue)?.estate?.assets
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })

  const { clearErrors, getValues } = useFormContext()
  const [total, setTotal] = useState(0)

  const estateData = getEstateDataFromApplication(application)

  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: AssetFormField) => {
      if (!current.enabled) return acc
      const currentValue = valueToNumber(current.marketValue ?? '0', ',')
      return Number(acc) + currentValue
    }, 0)

    setTotal(total)
  }, [getValues, id])

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.assets) {
      replace(estateData.estate.assets)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    calculateTotal()
  }, [fields, calculateTotal])

  const handleAddProperty = () =>
    append({
      share: 100,
      assetNumber: undefined,
      description: undefined,
      marketValue: undefined,
      initial: false,
      enabled: true,
    })
  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, asset: AssetFormField, index) => {
          const fieldError = error && error[index] ? error[index] : null
          if (!asset.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
              key={asset.id}
            >
              <ProfileCard
                disabled={!asset.enabled}
                title={asset.description}
                description={[
                  `${formatMessage(m.propertyNumber)}: ${asset.assetNumber}`,
                  asset.share
                    ? `${formatMessage(m.propertyShare)}: ${asset.share}%`
                    : '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={asset.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() => {
                        const updatedAsset = {
                          ...asset,
                          enabled: !asset.enabled,
                        }
                        update(index, updatedAsset)
                        clearErrors(`${id}[${index}].marketValue`)
                      }}
                    >
                      {asset.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
              />
              <Box marginTop={2}>
                <InputController
                  id={`${id}[${index}].marketValue`}
                  name={`${id}[${index}].marketValue`}
                  label={formatMessage(m.realEstateValueTitle)}
                  disabled={!asset.enabled}
                  backgroundColor="blue"
                  placeholder="0 kr."
                  defaultValue={asset.marketValue}
                  error={fieldError?.marketValue}
                  currency
                  size="sm"
                  required
                  onChange={() => calculateTotal()}
                />
              </Box>
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: AssetFormField, index) => {
        if (field.initial) {
          return null
        }

        return (
          <Box key={field.id}>
            <AdditionalRealEstate
              field={field}
              fieldName={id}
              remove={handleRemoveProperty}
              index={index}
              error={error && error[index] ? error[index] : null}
              calculateTotal={calculateTotal}
            />
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddProperty}
          size="small"
        >
          {formatMessage(m.addProperty)}
        </Button>
      </Box>
      {!!fields.length && (
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

export default RealEstateRepeater
