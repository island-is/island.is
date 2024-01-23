import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { VehiclesCurrentVehicle } from '../../shared'
import { information } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { GetVehicleDetailInput } from '@island.is/api/schema'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleFindField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentVehicleList[parseInt(vehicleValue, 10)]
  const [vehicleNotFound, setVehicleNotFound] = useState<boolean>()
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)
  const updateInputState = (value: string) => {
    setButtonDisabled(value.length !== 5)
    setPlate(value)
  }
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehiclesCurrentVehicle | null>(
      currentVehicle && currentVehicle.permno
        ? {
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
          }
        : null,
    )

  const getVehicleDetails = useLazyVehicleDetails()
  const findVehicleByPlate = () => {
    setIsLoading(true)
    if (plate) {
      getVehicleDetailsCallback({
        permno: plate.toUpperCase(),
      })
        .then((response) => {
          console.log('response', response)
          setSelectedVehicle({
            permno:
              response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
                ?.permno || '',
            make:
              response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
                ?.make || '',
            color:
              response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
                ?.color || '',
          })

          setPlate(plate)
          setValue(
            'pickVehicle.type',
            response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
              ?.make,
          )
          setValue('pickVehicle.plate', plate)
          setValue(
            'pickVehicle.color',
            response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
              ?.color || undefined,
          )
          setValue(
            'pickVehicle.requireMilage',
            response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
              ?.requireMileage || false,
          )
          if (plate) setValue('vehicleInfo.plate', plate)
          if (plate)
            setValue(
              'vehicleInfo.type',
              response.vehicleOwnerchangeChecksByPermno?.basicVehicleInformation
                ?.make,
            )
          setVehicleNotFound(false)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setVehicleNotFound(true)
          setIsLoading(false)
        })
    }
  }
  const getVehicleDetailsCallback = useCallback(
    async ({ permno }: GetVehicleDetailInput) => {
      const { data } = await getVehicleDetails({
        permno,
      })
      return data
    },
    [getVehicleDetails],
  )

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="spaceBetween">
        <InputController
          id="findVehicle.plate"
          name="findVehicle.plate"
          label={formatMessage(
            information.labels.pickVehicle.findPlatePlaceholder,
          )}
          onChange={(event) => {
            updateInputState(event.target.value)
          }}
          required={true}
          defaultValue={plate}
          rules={{
            required: true,
            validate: (value) => {
              if (value.length !== 5) {
                return false
              }
              return true
            },
          }}
          maxLength={5}
        />
        <Button onClick={findVehicleByPlate} disabled={buttonDisabled}>
          {formatMessage(information.labels.pickVehicle.findButton)}
        </Button>
      </Box>

      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {vehicleNotFound && (
              <AlertMessage
                type="error"
                title={'Errorinn'}
                message={formatMessage(
                  information.labels.pickVehicle.notFoundTitle,
                  { plate },
                )}
              />
            )}
            {selectedVehicle && !vehicleNotFound && (
              <ActionCard
                backgroundColor={'blue'}
                heading={selectedVehicle.make || ''}
                text={`${selectedVehicle.color} - ${selectedVehicle.permno}`}
                focused={true}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
