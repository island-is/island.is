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
import { Answers, AssetFormField } from '../../types'

import { EstateAsset } from '@island.is/clients/syslumenn'

import * as styles from '../styles.css'
import { m } from '../../lib/messages'

export const VehiclesRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
  errors,
}) => {
  const error = (errors as any)?.estate?.vehicles
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update } = useFieldArray({
    name: id,
  })
  const { control } = useFormContext()

  const externalData = application.externalData.syslumennOnEntry?.data as {
    estate: { vehicles: EstateAsset[] }
  }

  useEffect(() => {
    if (fields.length === 0 && externalData.estate.vehicles) {
      append(externalData.estate.vehicles)
    }
  }, [])

  const handleAddVehicle = () =>
    append({
      assetNumber: '',
      description: '',
      marketValue: '',
    })
  const handleRemoveVehicle = (index: number) => remove(index)

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
                  defaultValue={(asset as any).marketValue}
                  error={fieldError?.marketValue}
                  currency
                  size="sm"
                />
              </Box>
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: AssetFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const vehicleNumberField = `${fieldIndex}.assetNumber`
        const vehicleTypeField = `${fieldIndex}.description`
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
            <Text variant="h4">{formatMessage(m.vehiclesTitle)}</Text>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveVehicle.bind(null, index)}
              />
            </Box>
            <GridRow>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={vehicleNumberField}
                  name={vehicleNumberField}
                  label={formatMessage(m.vehicleNumberLabel)}
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
                  id={vehicleTypeField}
                  name={vehicleTypeField}
                  label={formatMessage(m.vehicleTypeLabel)}
                  defaultValue={field.description}
                  placeholder={formatMessage(m.vehiclesPlaceholder)}
                  size="sm"
                  //Make readOnly again when Vehicle Registry query is available
                  //readOnly
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={marketValueField}
                  name={marketValueField}
                  label={formatMessage(m.marketValueTitle)}
                  defaultValue={(field as any).marketValue}
                  placeholder={'0 kr.'}
                  currency
                  size="sm"
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddVehicle}
          size="small"
        >
          {formatMessage(m.addVehicle)}
        </Button>
      </Box>
    </Box>
  )
}

export default VehiclesRepeater
