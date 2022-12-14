import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import { Box, CategoryCard, SkeletonLoader } from '@island.is/island-ui/core'
import {
  VehiclesCurrentVehicle,
  GetVehicleDetailInput,
  VehiclesCurrentVehicleWithOwnerchangeChecks,
} from '@island.is/api/schema'
import { information, applicationCheck } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  VehicleSearchFieldProps & FieldBaseProps
> = ({ currentVehicleList, application }) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentVehicleList[parseInt(vehicleValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState<VehiclesCurrentVehicleWithOwnerchangeChecks | null>(
    currentVehicle && currentVehicle.permno
      ? {
          permno: currentVehicle.permno,
          make: currentVehicle?.make || '',
          color: currentVehicle?.color || '',
          role: currentVehicle?.role,
          isDebtLess: true,
          updatelocks: [],
          ownerChangeErrorMessages: [],
        }
      : null,
  )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const [color, setColor] = useState<string | undefined>(
    getValueViaPath(application.answers, 'pickVehicle.color', undefined) as
      | string
      | undefined,
  )

  const getVehicleDetails = useLazyVehicleDetails()

  const onChange = (option: Option) => {
    const currentVehicle = currentVehicleList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentVehicle.permno) {
      getVehicleDetailsCallback({
        permno: currentVehicle.permno,
      })
        .then((response) => {
          setSelectedVehicle({
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
            isDebtLess: response?.vehicleOwnerchangeChecksByPermno?.isDebtLess,
            updatelocks:
              response?.vehicleOwnerchangeChecksByPermno?.updatelocks,
            ownerChangeErrorMessages:
              response?.vehicleOwnerchangeChecksByPermno
                ?.ownerChangeErrorMessages,
          })

          const disabled =
            !response?.vehicleOwnerchangeChecksByPermno?.isDebtLess ||
            !!response?.vehicleOwnerchangeChecksByPermno?.updatelocks?.length ||
            !!response?.vehicleOwnerchangeChecksByPermno
              ?.ownerChangeErrorMessages?.length
          setPlate(disabled ? '' : currentVehicle.permno || '')
          setColor(currentVehicle.color || undefined)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
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

  const errorTags = []
  if (!selectedVehicle?.isDebtLess) {
    errorTags.push({
      label: formatMessage(information.labels.pickVehicle.isNotDebtLessTag),
    })
  }
  if (selectedVehicle?.updatelocks?.length) {
    for (let i = 0; i < selectedVehicle.updatelocks.length; i++) {
      const message = formatMessage(
        getValueViaPath(
          applicationCheck.locks,
          selectedVehicle.updatelocks[i].lockNo || '',
        ),
      )
      const fallbackMessage =
        formatMessage(applicationCheck.locks['0']) +
        ' - ' +
        selectedVehicle.updatelocks[i].lockNo

      errorTags.push({
        label: message || fallbackMessage,
      })
    }
  }
  if (selectedVehicle?.ownerChangeErrorMessages?.length) {
    for (let i = 0; i < selectedVehicle.ownerChangeErrorMessages.length; i++) {
      const message = formatMessage(
        getValueViaPath(
          applicationCheck.validation,
          selectedVehicle.ownerChangeErrorMessages[i].errorNo || '',
        ),
      )
      const defaultMessage =
        selectedVehicle.ownerChangeErrorMessages[i].defaultMessage
      const fallbackMessage =
        formatMessage(applicationCheck.validation['0']) +
        ' - ' +
        selectedVehicle.ownerChangeErrorMessages[i].errorNo

      errorTags.push({
        label: message || defaultMessage || fallbackMessage,
      })
    }
  }

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle, index) => {
          return {
            value: index.toString(),
            label: `${vehicle.make} - ${vehicle.permno}` || '',
          }
        })}
        placeholder={formatMessage(information.labels.pickVehicle.placeholder)}
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {selectedVehicle && (
              <CategoryCard
                colorScheme={errorTags.length > 0 ? 'red' : 'blue'}
                heading={selectedVehicle.make || ''}
                text={`${selectedVehicle.color} - ${selectedVehicle.permno}`}
                tags={errorTags}
              />
            )}
          </Box>
        )}
      </Box>
      <input
        type="hidden"
        value={plate}
        ref={register({ required: true })}
        name="pickVehicle.plate"
      />
      <input
        type="hidden"
        value={color}
        ref={register({ required: true })}
        name="pickVehicle.color"
      />
    </Box>
  )
}
