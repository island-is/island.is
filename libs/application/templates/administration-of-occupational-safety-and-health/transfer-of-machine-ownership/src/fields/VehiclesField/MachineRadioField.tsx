import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import { Machine } from '../../shared'
import { information, error } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLazyMachineDetails } from '../../hooks/useLazyVehicleDetails'
import { MachineDetailsInput } from '@island.is/api/schema'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface MachineSearchFieldProps {
  currentMachineList: Machine[]
}

export const MachineRadioField: FC<
  React.PropsWithChildren<MachineSearchFieldProps & FieldBaseProps>
> = ({ currentMachineList, application, errors }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [regNumber, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'machine.regNumber', '') as string,
  )
  const getMachineDetails = useLazyMachineDetails()
  const getMachineDetailsCallback = useCallback(
    async ({ id }: MachineDetailsInput) => {
      const { data } = await getMachineDetails({
        input: {
          id: id,
        },
      })
      return data
    },
    [getMachineDetails],
  )

  const onRadioControllerSelect = (s: string) => {
    const currentMachine = currentMachineList[parseInt(s, 10)]
    console.log('onRadioController')
    setIsLoading(true)
    if (currentMachine.id) {
      getMachineDetailsCallback({
        id: currentMachine.id,
      }).then((response) => {
        console.log('response', response)
        // setSelectedMachine({
        //   id: currentVehicle.id,
        //   registrationNumber: currentVehicle.registrationNumber,
        //   type: currentVehicle.type,
        //   ownerName: currentVehicle.owner,
        //   supervisorName: currentVehicle.supervisor,
        //   status: currentVehicle.status,
        //   _links: currentVehicle._links,
        //   category: currentVehicle.category,
        //   ownerNumber: response.machineDetails.ownerNumber,
        // })
        //currentVehicle.ownerNumber = response?.machineDetails?.ownerNumber || ''
        const disabled = isCurrentMachineDisabled(currentMachine?.status)
        console.log('currentMachine', currentMachine)
        setValue(
          'machine.regNumber',
          response.machineDetails.registrationNumber,
        )
        setValue('machine.category', response.machineDetails.category)
        setValue(
          'machine.type',
          response.machineDetails?.type?.split(' ')[0].trim(),
        )
        setValue(
          'machine.subType',
          response.machineDetails?.type?.split(' ')[1].trim(),
        )
        setValue('machine.plate', response.machineDetails.licensePlateNumber)
        setValue('machine.ownerNumber', response.machineDetails.ownerNumber)
        setValue('machine.id', currentMachine.id)
        setPlate(disabled ? '' : currentMachine.registrationNumber || '')

        setIsLoading(false)
      })
    }

    setPlate(currentMachine.registrationNumber || '')
  }

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

  const vehicleOptions = (machines: Machine[]) => {
    const options = [] as Option[]
    for (const [index, machine] of machines.entries()) {
      const disabled = isCurrentMachineDisabled(machine.status)
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {machine.registrationNumber}
              </Text>
              <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                {machine.category}: {machine.type}
              </Text>
              {!disabled && (
                <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                  {machine.supervisor}
                </Text>
              )}
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickVehicle.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!!machine.status?.length && (
                          <Bullet>{machine.status}</Bullet>
                        )}
                      </BulletList>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <div>
      <RadioController
        id="machine"
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={vehicleOptions(currentMachineList as Machine[])}
      />
      {regNumber.length === 0 && (errors as any)?.machine && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </div>
  )
}
