import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { CheckboxController } from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import { GET_VEHICLE_INFORMATION } from '../graphql/queries'
import { getErrorViaPath } from '@island.is/application/core'
import { PlateType, VehiclesCurrentVehicle } from '../shared'
import { information } from '../lib/messages'
import { getSelectedVehicle } from '../utils'

export const PickPlateSize: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, errors, setFieldLoadingState } = props

  const vehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  ) as VehiclesCurrentVehicle

  const { data, loading, error } = useQuery(
    gql`
      ${GET_VEHICLE_INFORMATION}
    `,
    {
      variables: {
        input: {
          permno: vehicle.permno,
          regno: '',
          vin: '',
        },
      },
    },
  )

  const plateTypeList = application.externalData.plateTypeList
    .data as PlateType[]

  const currentPlateTypeFront =
    data?.vehiclesDetail?.registrationInfo?.plateTypeFront
  const currentPlateTypeRear =
    data?.vehiclesDetail?.registrationInfo?.plateTypeRear

  // Plate type front should always be defined (rear type can be empty in some cases)
  const plateTypeFrontError = !currentPlateTypeFront

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

  return (
    <Box paddingTop={2}>
      {loading ? (
        <SkeletonLoader
          height={100}
          space={2}
          repeat={2}
          borderRadius="large"
        />
      ) : !error && !plateTypeFrontError ? (
        <>
          <Text variant="h5" marginTop={2} marginBottom={1}>
            {formatMessage(information.labels.plateSize.frontPlateSubtitle)}
          </Text>
          <CheckboxController
            id={`${props.field.id}.frontPlateSize`}
            error={
              errors && getErrorViaPath(errors, 'plateSize.frontPlateSize')
            }
            defaultValue={[]}
            options={plateTypeList
              ?.filter((x) => x.code === currentPlateTypeFront)
              ?.map((x) => ({
                value: x.code || '',
                label:
                  formatMessage(
                    information.labels.plateSize.plateSizeOptionTitle,
                    {
                      name: x.name,
                      height: x.plateHeight,
                      width: x.plateWidth,
                    },
                  ) || '',
              }))}
          />
          {currentPlateTypeRear && (
            <>
              <Text variant="h5" marginTop={2} marginBottom={1}>
                {formatMessage(information.labels.plateSize.rearPlateSubtitle)}
              </Text>
              <CheckboxController
                id={`${props.field.id}.rearPlateSize`}
                error={
                  errors && getErrorViaPath(errors, 'plateSize.rearPlateSize')
                }
                defaultValue={[]}
                options={plateTypeList
                  ?.filter((x) => x.code === currentPlateTypeRear)
                  ?.map((x) => ({
                    value: x.code || '',
                    label:
                      formatMessage(
                        information.labels.plateSize.plateSizeOptionTitle,
                        {
                          name: x.name,
                          height: x.plateHeight,
                          width: x.plateWidth,
                        },
                      ) || '',
                  }))}
              />
            </>
          )}
        </>
      ) : (
        <Box marginTop={3}>
          <AlertMessage
            type="error"
            title={formatMessage(
              error
                ? information.labels.plateSize.error
                : information.labels.plateSize.errorPlateTypeFront,
            )}
          />
        </Box>
      )}
    </Box>
  )
}
