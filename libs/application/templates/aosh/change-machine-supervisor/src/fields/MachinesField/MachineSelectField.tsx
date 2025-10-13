import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  SkeletonLoader,
  InputError,
  ActionCard,
} from '@island.is/island-ui/core'
import { information, error } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyMachineDetails } from '../../hooks/useLazyMachineDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { MachineDto } from '@island.is/clients/work-machines'

interface MachineSearchFieldProps {
  currentMachineList: MachineDto[]
}

export const MachineSelectField: FC<
  React.PropsWithChildren<MachineSearchFieldProps & FieldBaseProps>
> = ({ currentMachineList, application, setFieldLoadingState, field }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const machineValue = getValueViaPath(
    application.answers,
    'machine',
    '',
  ) as string

  const [isSelected, setSelected] = useState<boolean>(false)
  const currentMachine = currentMachineList[parseInt(machineValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedMachine, setSelectedMachine] = useState<MachineDto | null>(
    currentMachine && currentMachine.regNumber ? currentMachine : null,
  )
  const [machineId, setMachineId] = useState<string>(
    getValueViaPath<string>(application.answers, 'machine.id', '') || '',
  )

  const getMachineDetails = useLazyMachineDetails()
  const getMachineDetailsCallback = useCallback(
    async (id: string) => {
      const { data } = await getMachineDetails({
        id: id,
        rel: 'supervisorChange',
      })
      return data
    },
    [getMachineDetails],
  )

  const onChange = (option: Option) => {
    const currentMachine = currentMachineList[parseInt(option.value, 10)]
    setIsLoading(true)
    setSelected(true)
    if (currentMachine.id) {
      getMachineDetailsCallback(currentMachine.id)
        .then((response) => {
          setSelectedMachine(response.getWorkerMachineDetails)
          setValue(
            'machine.regNumber',
            response.getWorkerMachineDetails.regNumber,
          )
          setValue(
            'machine.category',
            response.getWorkerMachineDetails.category,
          )

          setValue('machine.type', response.getWorkerMachineDetails.type || '')
          setValue(
            'machine.subType',
            response.getWorkerMachineDetails.subType || '',
          )
          setValue(
            'machine.plate',
            response.getWorkerMachineDetails.plate || '',
          )
          setValue(
            'machine.ownerNumber',
            response.getWorkerMachineDetails.ownerNumber || '',
          )
          setValue('machine.id', response.getWorkerMachineDetails.id)
          setValue('machine.date', new Date().toISOString())
          setValue('machine.findVehicle', true)
          setValue(
            'machine.isValid',
            response.getWorkerMachineDetails.disabled ? undefined : true,
          )
          setMachineId(currentMachine?.id || '')
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    }
  }

  useEffect(() => {
    setFieldLoadingState?.(isLoading)
  }, [isLoading, setFieldLoadingState])

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickMachine.vehicle)}
        id={`${field.id}.index`}
        name={`${field.id}.index`}
        onSelect={(option) => onChange(option as Option)}
        options={currentMachineList.map((machine, index) => {
          return {
            value: index.toString(),
            label: `${machine.type} (${machine.regNumber})` || '',
          }
        })}
        placeholder={formatMessage(information.labels.pickMachine.placeholder)}
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {selectedMachine && (
              <ActionCard
                backgroundColor={selectedMachine.disabled ? 'red' : 'blue'}
                heading={selectedMachine.regNumber || ''}
                text={`${selectedMachine.type} ${selectedMachine.subType}`}
                focused={true}
              />
            )}
            {selectedMachine && selectedMachine.disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickMachine.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!!selectedMachine.status?.length && (
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
      {machineId.length === 0 && !isLoading && isSelected ? (
        <InputError errorMessage={formatMessage(error.requiredValidMachine)} />
      ) : null}
    </Box>
  )
}
