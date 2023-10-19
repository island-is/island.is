import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  CategoryCard,
  SkeletonLoader,
  InputError,
} from '@island.is/island-ui/core'
import { GetVehicleDetailInput } from '@island.is/api/schema'
import { information, applicationCheck, error } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import {
  Machine,
  VehiclesCurrentVehicle,
  VehiclesCurrentVehicleWithOwnerchangeChecks,
} from '../../shared'
import { stat } from 'fs'
import { ConsoleLogger } from '@nestjs/common'

interface VehicleSearchFieldProps {
  currentMachineList: Machine[]
}

export const VehicleSelectField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentMachineList, application, errors, setFieldLoadingState }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentMachineList[parseInt(vehicleValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(
    currentVehicle && currentVehicle.registrationNumber
      ? {
          id: currentVehicle.id,
          registrationNumber: currentVehicle.registrationNumber,
          type: currentVehicle.type,
          owner: currentVehicle.owner,
          supervisor: currentVehicle.supervisor,
          status: currentVehicle.status,
          dateLastInspection: currentVehicle.dateLastInspection,
          category: currentVehicle.category,
        }
      : null,
  )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )

  const getVehicleDetails = useLazyVehicleDetails()

  // Statuses for Machines for if they appear disabled or not
  //"Forskráð"
  // "Læst" DISABLED
  // "Í skráningarferli" DISABLED
  // "Eigandaskipti í gangi" DISABLED
  // "Umráðamannaskipti í gangi" DISABLED
  // "Í notkun"
  // "Götuskráning í gangi"
  // "Afskráð tímabundið" DISABLED
  // "Afskráð endanlega" DISABLED
  const onChange = (option: Option) => {
    const currentVehicle = currentMachineList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentVehicle.registrationNumber) {
      setSelectedMachine({
        id: currentVehicle.id,
        registrationNumber: currentVehicle.registrationNumber,
        type: currentVehicle.type,
        owner: currentVehicle.owner,
        supervisor: currentVehicle.supervisor,
        status: currentVehicle.status,
        dateLastInspection: currentVehicle.dateLastInspection,
        _links: currentVehicle._links,
        category: currentVehicle.category,
      })

      const disabled = isCurrentMachineDisabled(selectedMachine?.status)
      console.log('currentMachine', selectedMachine)
      setPlate(disabled ? '' : currentVehicle.registrationNumber || '')
      setValue('vehicle.plate', currentVehicle.registrationNumber)
      setValue('vehicle.type', currentVehicle.type)
      setValue('vehicle.date', new Date().toISOString().substring(0, 10))
      setValue(
        'pickVehicle.plate',
        disabled ? '' : currentVehicle.registrationNumber || '',
      )
      //setValue('pickVehicle.color', currentVehicle.color || undefined)
      setIsLoading(false)
    }
  }
  // Use this when Links have been added to machine
  // const isCurrentMachineDisabled = (machine: Machine | undefined | null) => !machine?._links?.some((link) => link.rel === "ownerChange");

  function isCurrentMachineDisabled(status?: string): boolean {
    const disabledStatuses = [
      'Læst',
      'Í skráningarferli',
      'Eigandaskipti í gangi',
      'Umráðamannaskipti í gangi',
      'Afskráð tímabundið',
      'Afskráð endanlega',
    ]
    if (status === undefined) return true
    if (disabledStatuses.includes(status)) {
      return true
    } else {
      return false
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

  // const disabled =
  //   selectedVehicle &&
  //   (!selectedVehicle.isDebtLess ||
  //     !!selectedVehicle.validationErrorMessages?.length)

  useEffect(() => {
    setFieldLoadingState?.(isLoading)
  }, [isLoading])

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={(option) => onChange(option as Option)}
        options={currentMachineList.map((vehicle, index) => {
          return {
            value: index.toString(),
            label: `${vehicle.type}` || '',
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
            {selectedMachine && (
              <CategoryCard
                colorScheme={
                  isCurrentMachineDisabled(selectedMachine.status)
                    ? 'red'
                    : 'blue'
                }
                heading={selectedMachine.registrationNumber || ''} //selectedMachine.make || ''}
                text={`${selectedMachine.type}`}
              />
            )}
            {selectedMachine &&
              isCurrentMachineDisabled(selectedMachine.status) && (
                <Box marginTop={2}>
                  <AlertMessage
                    type="error"
                    title={formatMessage(
                      information.labels.pickVehicle.hasErrorTitle,
                    )}
                    message={
                      <Box>
                        <BulletList>
                          {/* {!selectedMachine.isDebtLess && (
                          <Bullet>
                            {formatMessage(
                              information.labels.pickVehicle.isNotDebtLessTag,
                            )}
                          </Bullet>
                        )} */}
                          {isCurrentMachineDisabled(selectedMachine.status) && (
                            <Bullet>{selectedMachine.status}</Bullet>
                          )}
                        </BulletList>
                      </Box>
                    }
                  />
                </Box>
              )}
          </Box>
        )}
      </Box>
      {!isLoading && plate.length === 0 && (errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
