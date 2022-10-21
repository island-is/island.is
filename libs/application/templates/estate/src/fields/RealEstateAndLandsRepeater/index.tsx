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
import { Answers, Asset } from '../../types'

import { m } from '../../lib/messages'
import { EstateAsset } from '@island.is/clients/syslumenn'
import { AdditionalRealEstateOrLand } from './AdditionalRealEstateOrLand'

export const RealEstateAndLandsRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
  errors,
}) => {
  const error = (errors as any)?.estate?.assets
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Asset>({
    name: id,
  })

  const { setValue } = useFormContext()

  const externalData = application.externalData.syslumennOnEntry?.data as {
    estate: { assets: EstateAsset[] }
  }

  useEffect(() => {
    if (
      fields.length === 0 &&
      (!application.answers.assets ||
        !application.answers.assets?.encountered) &&
      externalData.estate.assets
    ) {
      append(externalData.estate.assets)
    }
  }, [])

  const handleAddProperty = () =>
    append({
      share: 1,
      assetNumber: '',
      description: '',
      initial: false,
      enabled: true,
    })
  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, asset, index) => {
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
                    ? `${formatMessage(m.propertyShare)}: ${asset.share * 100}%`
                    : '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={asset.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() =>
                        setValue(`${id}[${index}].enabled`, !asset.enabled)
                      }
                    >
                      {asset.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
                heightFull
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field, index) => (
        <Box key={field.id} hidden={field.initial || field?.dummy}>
          <AdditionalRealEstateOrLand
            field={field}
            fieldName={id}
            remove={handleRemoveProperty}
            index={index}
            error={error && error[index] ? error[index] : null}
          />
        </Box>
      ))}
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

export default RealEstateAndLandsRepeater
