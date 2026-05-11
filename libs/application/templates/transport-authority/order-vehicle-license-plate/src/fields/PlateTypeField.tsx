import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  InputError,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import {
  GET_VEHICLE_CURRENT_PLATES,
  GET_VEHICLE_PLATE_ORDER_OPTIONS,
} from '../graphql/queries'
import { information } from '../lib/messages'
import { getSelectedVehicle } from '../utils'
import { useFormContext, useWatch } from 'react-hook-form'
import { getErrorViaPath } from '@island.is/application/core'

interface PlateOptionType {
  plateType?: string | null
  plateTypeName?: string | null
}

export const PlateTypeField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, setFieldLoadingState, errors } = props
  const { setValue, control } = useFormContext()

  const selectedPlateType = useWatch({
    control,
    name: 'plateType.regGroup',
  })

  const vehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  )

  const {
    data: currentPlatesData,
    loading: currentPlatesLoading,
    error: currentPlatesError,
  } = useQuery(
    gql`
      ${GET_VEHICLE_CURRENT_PLATES}
    `,
    {
      variables: {
        permno: vehicle?.permno,
      },
      skip: !vehicle?.permno,
    },
  )

  const {
    data: optionsData,
    loading: optionsLoading,
    error: optionsError,
  } = useQuery(
    gql`
      ${GET_VEHICLE_PLATE_ORDER_OPTIONS}
    `,
    {
      variables: {
        permno: vehicle?.permno,
      },
      skip: !vehicle?.permno,
    },
  )

  const loading = currentPlatesLoading || optionsLoading
  const error = currentPlatesError || optionsError

  const plates: PlateOptionType[] =
    optionsData?.vehiclePlateOrderOptions?.plates ?? []

  const currentPlateTypeName =
    currentPlatesData?.vehicleCurrentPlates?.plateTypeName

  // Populate selectedPlateTypeName when data loads and a value is already selected
  useEffect(() => {
    if (!loading && plates.length > 0 && selectedPlateType) {
      const match = plates.find((p) => p.plateType === selectedPlateType)
      if (match?.plateTypeName) {
        setValue('plateType.selectedPlateTypeName', match.plateTypeName)
      }
    }
  }, [loading, plates, selectedPlateType, setValue])

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading, setFieldLoadingState])

  return (
    <Box paddingTop={2}>
      {loading ? (
        <SkeletonLoader
          height={100}
          space={2}
          repeat={2}
          borderRadius="large"
        />
      ) : error ? (
        <AlertMessage
          type="error"
          title={formatMessage(information.labels.plateType.error)}
        />
      ) : plates.length > 0 ? (
        <>
          {currentPlateTypeName && (
            <Box marginBottom={3}>
              <Text variant="h5" marginBottom={1}>
                {formatMessage(information.labels.plateType.currentPlateLabel)}
              </Text>
              <InputController
                id="plateType.currentPlateTypeName"
                label={formatMessage(
                  information.labels.plateType.currentPlateSubLabel,
                )}
                defaultValue={currentPlateTypeName}
                readOnly
                backgroundColor="white"
              />
            </Box>
          )}
          <Box marginBottom={2}>
            <Text variant="h5" marginBottom={1}>
              {formatMessage(
                information.labels.plateType.availablePlateTypesLabel,
              )}
            </Text>
            <RadioController
              id="plateType.regGroup"
              largeButtons
              backgroundColor="blue"
              defaultValue={
                (
                  application.answers as {
                    plateType?: { regGroup?: string }
                  }
                )?.plateType?.regGroup
              }
              options={plates.map((plate) => ({
                value: plate.plateType || '',
                label: plate.plateTypeName || '',
              }))}
              onSelect={(value) => {
                setValue('plateType.regGroup', value)
                setValue(
                  'plateType.selectedPlateTypeName',
                  plates.find((p) => p.plateType === value)?.plateTypeName,
                )
              }}
            />
            {errors && getErrorViaPath(errors, 'plateType.regGroup') && (
              <InputError
                errorMessage={
                  getErrorViaPath(errors, 'plateType.regGroup') ?? ''
                }
              />
            )}
          </Box>
          {selectedPlateType === 'N5' && (
            <Box marginBottom={2}>
              <AlertMessage
                type="info"
                message={formatMessage(
                  information.labels.plateType.vskAlertMessage,
                )}
              />
            </Box>
          )}
          {selectedPlateType === 'K1' && (
            <Box marginBottom={2}>
              <AlertMessage
                type="info"
                message={formatMessage(
                  information.labels.plateType.aukamerkiAlertMessage,
                )}
              />
            </Box>
          )}
        </>
      ) : (
        <AlertMessage
          type="warning"
          title={formatMessage(information.labels.plateType.noPlateTypeFound)}
        />
      )}
    </Box>
  )
}
