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
import { useLazyMachineDetailsByRegno } from '../../hooks/useLazyMachineDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { MachineForInspectionDto } from '@island.is/clients/work-machines'

interface MachineSearchFieldProps {
  currentMachineList: MachineForInspectionDto[]
}

export const MachineSelectField: FC<
  React.PropsWithChildren<MachineSearchFieldProps & FieldBaseProps>
> = ({
  currentMachineList,
  application,
  setFieldLoadingState,
  field,
  setSubmitButtonDisabled,
}) => {
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
  const [selectedMachine, setSelectedMachine] =
    useState<MachineForInspectionDto | null>(
      currentMachine && currentMachine.registrationNumber
        ? currentMachine
        : null,
    )
  const [machineId, setMachineId] = useState<string>(
    getValueViaPath<string>(application.answers, 'machine.id', '') || '',
  )

  const getMachineDetails = useLazyMachineDetailsByRegno()
  const getMachineDetailsCallback = useCallback(
    async (registrationNumber: string) => {
      const { data } = await getMachineDetails({
        input: { registrationNumber: registrationNumber },
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
      getMachineDetailsCallback(currentMachine.registrationNumber || '')
        .then((response) => {
          setSelectedMachine(response.getWorkerMachineDetailsByRegno)
          setValue(
            'machine.regNumber',
            response.getWorkerMachineDetailsByRegno.registrationNumber,
          )
          setValue(
            'machine.category',
            response.getWorkerMachineDetailsByRegno.category,
          )

          setValue(
            'machine.type',
            response.getWorkerMachineDetailsByRegno.type || '',
          )
          setValue(
            'machine.subType',
            response.getWorkerMachineDetailsByRegno.subType || '',
          )
          setValue(
            'machine.plate',
            response.getWorkerMachineDetailsByRegno.licensePlateNumber || '',
          )
          setValue(
            'machine.ownerNumber',
            response.getWorkerMachineDetailsByRegno.ownerNumber || '',
          )
          setValue('machine.id', response.getWorkerMachineDetailsByRegno.id)
          setValue('machine.date', new Date().toISOString())
          setValue('machine.findVehicle', true)
          setValue(
            'machine.isValid',
            response.getWorkerMachineDetailsByRegno.disabled ? undefined : true,
          )
          setMachineId(currentMachine?.id || '')
          setIsLoading(false)
          setSubmitButtonDisabled?.(false)
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
            label: `${machine.registrationNumber}` || '',
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
                heading={selectedMachine.registrationNumber || ''}
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
