import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'

import { m } from '../../lib/messages'
import { AdditionalRealEstate } from './AdditionalRealEstate'
import { InputController } from '@island.is/shared/form-fields'
import { getEstateDataFromApplication } from '../../lib/utils'

export const RealEstateRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, errors }) => {
  const error = (errors as ErrorValue)?.estate?.assets
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })

  const { clearErrors } = useFormContext()

  const estateData = getEstateDataFromApplication(application)

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.assets) {
      replace(estateData.estate.assets)
    }
  }, [])

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
            />
          </Box>
        )
      })}
      <Box marginTop={1}>
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
    </Box>
  )
}

export default RealEstateRepeater
