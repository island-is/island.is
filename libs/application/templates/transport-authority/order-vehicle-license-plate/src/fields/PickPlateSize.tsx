import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { FC, useEffect, useMemo, useRef } from 'react'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import {
  GET_VEHICLE_INFORMATION,
  GET_VEHICLE_PLATE_ORDER_OPTIONS,
} from '../graphql/queries'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { PlateType, PlateSizeOption, PlateOption } from '../shared'
import { information } from '../lib/messages'
import { getSelectedVehicle, formatPlateSize } from '../utils'
import { useFormContext, useWatch } from 'react-hook-form'
import { PlateVisual, SUPPORTED_PLATE_VISUALS } from './PlateVisual'

export const PickPlateSize: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, errors, setFieldLoadingState } = props
  const { setValue, control } = useFormContext()

  const selectedFrontSizes = useWatch({
    control,
    name: `${props.field.id}.frontPlateSize`,
  }) as string[] | undefined

  const selectedRearSizes = useWatch({
    control,
    name: `${props.field.id}.rearPlateSize`,
  }) as string[] | undefined

  const vehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  )

  const selectedPlateType = getValueViaPath<string>(
    application.answers,
    'plateType.regGroup',
  )

  const {
    data: vehicleData,
    loading: vehicleLoading,
    error: vehicleError,
  } = useQuery(
    gql`
      ${GET_VEHICLE_INFORMATION}
    `,
    {
      variables: {
        input: {
          permno: vehicle?.permno,
          regno: '',
          vin: '',
        },
      },
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

  const loading = vehicleLoading || optionsLoading
  const error = vehicleError || optionsError

  // Get all plate types from external data
  const plateTypeList = application.externalData.plateTypeList
    ?.data as PlateType[]

  // Get current plate types from vehicle data
  const currentPlateTypeFront =
    vehicleData?.vehiclesDetail?.registrationInfo?.plateTypeFront
  const currentPlateTypeRear =
    vehicleData?.vehiclesDetail?.registrationInfo?.plateTypeRear

  // Look up current plate size details from plateTypeList
  const currentFrontPlate = plateTypeList?.find(
    (x) => x.code === currentPlateTypeFront,
  )
  const currentRearPlate = plateTypeList?.find(
    (x) => x.code === currentPlateTypeRear,
  )

  // Get available sizes for the selected plate type
  const plates: PlateOption[] =
    optionsData?.vehiclePlateOrderOptions?.plates ?? []
  const selectedPlate = plates.find((p) => p.plateType === selectedPlateType)
  const availableSizes: PlateSizeOption[] = useMemo(
    () => selectedPlate?.plateSizes ?? [],
    [selectedPlate],
  )

  // Error states
  const plateTypeFrontError = !currentPlateTypeFront
  const noAvailableSizes = !loading && availableSizes.length === 0

  const rearResetRef = useRef(false)

  useEffect(() => {
    if (!loading && currentPlateTypeRear === null && !rearResetRef.current) {
      rearResetRef.current = true
      setValue(`${props.field.id}.rearPlateSize`, [])
    }
  }, [loading, currentPlateTypeRear, setValue, props.field.id])

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error, setFieldLoadingState])

  const sizeOptions = useMemo(
    () =>
      availableSizes.map((size) => ({
        value: size.plateSizeType || '',
        label: formatPlateSize(formatMessage, size) || '',
      })),
    [availableSizes, formatMessage],
  )

  const prevFrontRef = useRef<string>('')
  const prevRearRef = useRef<string>('')

  // Persist human-readable size names when selections change
  useEffect(() => {
    if (!selectedFrontSizes || availableSizes.length === 0) return
    const names = selectedFrontSizes
      .map((code) => sizeOptions.find((o) => o.value === code)?.label ?? code)
      .join(', ')
    if (names !== prevFrontRef.current) {
      prevFrontRef.current = names
      setValue(`${props.field.id}.frontPlateSizeName`, names)
    }
  }, [
    selectedFrontSizes,
    availableSizes,
    sizeOptions,
    setValue,
    props.field.id,
  ])

  useEffect(() => {
    if (!selectedRearSizes || availableSizes.length === 0) return
    const names = selectedRearSizes
      .map((code) => sizeOptions.find((o) => o.value === code)?.label ?? code)
      .join(', ')
    if (names !== prevRearRef.current) {
      prevRearRef.current = names
      setValue(`${props.field.id}.rearPlateSizeName`, names)
    }
  }, [selectedRearSizes, availableSizes, sizeOptions, setValue, props.field.id])

  return (
    <Box paddingTop={2}>
      {loading ? (
        <SkeletonLoader
          height={100}
          space={2}
          repeat={2}
          borderRadius="large"
        />
      ) : error || plateTypeFrontError || noAvailableSizes ? (
        <Box marginTop={3}>
          <AlertMessage
            type="error"
            title={formatMessage(
              noAvailableSizes
                ? information.labels.plateSize.noPlateMatchError
                : error
                ? information.labels.plateSize.error
                : information.labels.plateSize.errorPlateTypeFront,
            )}
          />
        </Box>
      ) : (
        <>
          {/* Current plate sizes */}
          <Text variant="h5" marginBottom={2}>
            {formatMessage(information.labels.plateSize.currentPlateTitle)}
          </Text>
          <GridRow marginBottom={3} rowGap={2}>
            <GridColumn span={['1/1', '1/2']}>
              <InputController
                id="plateSize.currentFrontSize"
                label={formatMessage(
                  information.labels.plateSize.frontPlateLabel,
                )}
                defaultValue={formatPlateSize(formatMessage, currentFrontPlate)}
                readOnly
                backgroundColor="blue"
              />
            </GridColumn>
            {currentPlateTypeRear && (
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id="plateSize.currentRearSize"
                  label={formatMessage(
                    information.labels.plateSize.rearPlateLabel,
                  )}
                  defaultValue={formatPlateSize(
                    formatMessage,
                    currentRearPlate,
                  )}
                  readOnly
                  backgroundColor="blue"
                />
              </GridColumn>
            )}
          </GridRow>

          {/* Plate size visuals */}
          {(() => {
            const sizesWithVisuals = availableSizes.filter(
              (s) =>
                s.plateWidth &&
                s.plateHeight &&
                SUPPORTED_PLATE_VISUALS.includes(
                  (s.plateSizeType ?? '').toUpperCase(),
                ),
            )
            if (sizesWithVisuals.length === 0) return null
            const maxW = Math.max(
              ...sizesWithVisuals.map((s) => s.plateWidth as number),
            )
            const scale = 200 / maxW
            return (
              <Box
                display="flex"
                flexDirection={['column', 'column', 'row']}
                justifyContent="spaceBetween"
                alignItems={['flexStart', 'flexStart', 'flexEnd']}
                marginBottom={3}
                rowGap={2}
              >
                {sizesWithVisuals.map((size) => {
                  const w = size.plateWidth as number
                  return (
                    <Box
                      key={size.plateSizeType}
                      display="flex"
                      flexDirection="row"
                      alignItems="flexEnd"
                    >
                      <Box marginRight={1}>
                        <Text variant="eyebrow">{size.plateSizeType}</Text>
                      </Box>
                      <Box
                        style={{
                          width: `${w * scale}px`,
                        }}
                      >
                        <PlateVisual code={size.plateSizeType} />
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )
          })()}

          {/* Size selection checkboxes */}
          <GridRow>
            <GridColumn span={['1/1', '1/2']}>
              <Text variant="h5" marginBottom={1}>
                {formatMessage(information.labels.plateSize.frontPlateSubtitle)}
              </Text>
              <CheckboxController
                id={`${props.field.id}.frontPlateSize`}
                error={
                  errors && getErrorViaPath(errors, 'plateSize.frontPlateSize')
                }
                defaultValue={[]}
                options={sizeOptions.map((o) => ({
                  ...o,
                  excludeOthers: true,
                }))}
              />
            </GridColumn>
            {currentPlateTypeRear && (
              <GridColumn span={['1/1', '1/2']}>
                <Text variant="h5" marginBottom={1}>
                  {formatMessage(
                    information.labels.plateSize.rearPlateSubtitle,
                  )}
                </Text>
                <CheckboxController
                  id={`${props.field.id}.rearPlateSize`}
                  error={
                    errors && getErrorViaPath(errors, 'plateSize.rearPlateSize')
                  }
                  defaultValue={[]}
                  options={sizeOptions.map((o) => ({
                    ...o,
                    excludeOthers: true,
                  }))}
                />
              </GridColumn>
            )}
          </GridRow>
        </>
      )}
    </Box>
  )
}
