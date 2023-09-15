import React, { FC, useEffect } from 'react'
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Answers, AssetFormField } from '../../types'

import * as styles from './styles.css'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'
import { EstateAsset } from '@island.is/clients/syslumenn'

export const RealEstateRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers>>
> = ({ application, field, errors }) => {
  const error = (errors as any)?.assets?.assets
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray({
    name: `${id}.assets`,
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
      setValue('assets.encountered', true)
    }
  }, [])

  const handleAddProperty = () =>
    append({
      share: 1,
      assetNumber: '',
      description: '',
      initial: false,
    })
  const handleRemoveProperty = (index: number) => remove(index)

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
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
              key={asset.id}
            >
              <ProfileCard
                title={asset.description}
                description={[
                  `${formatMessage(m.propertyNumber)}: ${asset.assetNumber}`,
                  asset.share
                    ? `${formatMessage(m.propertyShare)}: ${asset.share * 100}%`
                    : '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon="trash"
                      size="small"
                      iconType="outline"
                      onClick={() => remove(index)}
                    >
                      {formatMessage(m.inheritanceRemoveMember)}
                    </Button>
                  </Box>,
                ]}
                heightFull
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: AssetFormField, index) => (
        <Box key={field.id} hidden={field.initial || field?.dummy}>
          <Item
            field={field}
            fieldName={`${id}.assets`}
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

const Item = ({
  field,
  index,
  remove,
  fieldName,
  error,
}: {
  field: AssetFormField
  fieldName: string
  index: number
  remove: (index: number) => void
  error: any
}) => {
  const fieldIndex = `${fieldName}[${index}]`
  const propertyNumberField = `${fieldIndex}.assetNumber`
  const propertyNumberInput = useWatch({
    name: propertyNumberField,
    defaultValue: '',
  })
  const addressField = `${fieldIndex}.description`
  const address = useWatch({ name: addressField, defaultValue: '' })
  const initialField = `${fieldIndex}.initial`
  const dummyField = `${fieldIndex}.dummy`
  const shareField = `${fieldIndex}.share`
  const { control, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          setValue(
            addressField,
            data.searchForProperty?.defaultAddress?.display ?? '',
          )
        },
        fetchPolicy: 'network-only',
      },
    )

  useEffect(() => {
    // According to Skra.is:
    // https://www.skra.is/um-okkur/frettir/frett/2018/03/01/Nytt-fasteignanumer-og-itarlegri-skraning-stadfanga/
    // The property number is a seven digit informationless sequence.
    // Has the prefix F.
    if (/[Ff]{0,1}\d{7}$/.test(propertyNumberInput.trim().toUpperCase())) {
      getProperty({
        variables: {
          input: {
            propertyNumber: propertyNumberInput.trim().toUpperCase(),
          },
        },
      })
    } else if (!field.initial) {
      setValue(addressField, '')
    }
  }, [getProperty, address, addressField, propertyNumberInput, setValue])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={dummyField}
        control={control}
        defaultValue={field.dummy || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={shareField}
        control={control}
        defaultValue={field.share || 0}
        render={() => <input type="hidden" />}
      />

      <Box position="absolute" className={styles.removeFieldButton}>
        <Button
          variant="ghost"
          size="small"
          circle
          icon="remove"
          onClick={() => remove(index)}
        />
      </Box>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={propertyNumberField}
            name={propertyNumberField}
            label={formatMessage(m.propertyNumber)}
            backgroundColor="blue"
            defaultValue={field.assetNumber}
            error={error?.assetNumber ?? undefined}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={addressField}
            name={addressField}
            label={formatMessage(m.address)}
            loading={queryLoading}
            readOnly
            defaultValue={field.description}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
