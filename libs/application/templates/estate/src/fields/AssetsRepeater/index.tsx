import { FC, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
  Text,
} from '@island.is/island-ui/core'

import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { AssetFormField, AssetsRepeaterProps, ErrorValue } from '../../types'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

export const AssetsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & AssetsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const texts = field?.props?.texts
  const assetName = field?.props?.assetName
  const error = (errors as ErrorValue)?.estate?.[assetName]
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors, getValues } = useFormContext()
  const estateData = getEstateDataFromApplication(application)

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: AssetFormField) => field.marketValue,
  )

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.[assetName]) {
      replace(estateData.estate[assetName])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddAsset = () =>
    append({
      assetNumber: undefined,
      description: undefined,
      marketValue: undefined,
      share: 100,
    })
  const handleRemoveAsset = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, asset: AssetFormField, index) => {
          if (!asset.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={asset.id}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                disabled={!asset.enabled}
                title={asset.assetNumber}
                key={asset.assetNumber}
                description={[
                  `${asset.description}`,
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
                  label={formatMessage(m.marketValueTitle)}
                  disabled={!asset.enabled}
                  backgroundColor="blue"
                  placeholder="0 kr."
                  defaultValue={asset.marketValue}
                  error={error && error[index]?.marketValue}
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
        const fieldIndex = `${id}[${index}]`
        const assetNumberField = `${fieldIndex}.assetNumber`
        const assetTypeField = `${fieldIndex}.description`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const marketValueField = `${fieldIndex}.marketValue`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial}
          >
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={true}
              render={() => <input type="hidden" />}
            />
            <Text variant="h4">{formatMessage(texts.assetTitle)}</Text>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveAsset.bind(null, index)}
              />
            </Box>
            <GridRow>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={assetNumberField}
                  name={assetNumberField}
                  label={formatMessage(texts.assetNumber)}
                  backgroundColor="blue"
                  defaultValue={field.assetNumber}
                  error={fieldError?.assetNumber}
                  size="sm"
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={assetTypeField}
                  name={assetTypeField}
                  label={formatMessage(texts.assetType)}
                  defaultValue={field.description}
                  placeholder={''}
                  error={fieldError?.description}
                  size="sm"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={marketValueField}
                  name={marketValueField}
                  label={formatMessage(m.marketValueTitle)}
                  defaultValue={field.marketValue}
                  placeholder={'0 kr.'}
                  error={fieldError?.marketValue}
                  currency
                  size="sm"
                  onChange={() => calculateTotal()}
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddAsset}
          size="small"
        >
          {formatMessage(texts.addAsset)}
        </Button>
      </Box>
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default AssetsRepeater
