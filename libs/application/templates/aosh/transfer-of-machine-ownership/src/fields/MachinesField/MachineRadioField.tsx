import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { information, error } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { MachineDto } from '@island.is/clients/work-machines'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface MachineSearchFieldProps {
  currentMachineList: MachineDto[]
}

export const MachineRadioField: FC<
  React.PropsWithChildren<MachineSearchFieldProps & FieldBaseProps>
> = ({ currentMachineList, application }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [machineId, setMachineId] = useState<string>(
    getValueViaPath(application.answers, 'pickMachine.id', '') as string,
  )
  const [isSelected, setSelected] = useState<boolean>(false)
  const onRadioControllerSelect = (s: string) => {
    const currentMachine = currentMachineList[parseInt(s, 10)]
    setSelected(true)
    setValue('pickMachine.id', currentMachine.id)
    setValue('pickMachine.isValid', currentMachine.disabled ? undefined : true)
    setValue('machine.id', currentMachine.id)
    setValue('machine.category', currentMachine.category)
    setValue('machine.regNumber', currentMachine.regNumber)
    setValue('machine.type', currentMachine.type || '')
    setValue('machine.subType', currentMachine.subType || '')
    setValue('machine.date', new Date().toISOString())
    setValue('machine.ownerNumber', currentMachine.ownerNumber || '')
    setValue('machine.plate', currentMachine.plate || '')
    setMachineId(currentMachine.id || '')
  }

  const machineOptions = (machines: MachineDto[]) => {
    const options = [] as Option[]
    for (const [index, machine] of machines.entries()) {
      const disabled = machine.disabled
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {machine.regNumber}
              </Text>
              <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                {machine.category}: {machine.type}
              </Text>
              {!disabled && (
                <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                  {machine.supervisorName}
                </Text>
              )}
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickMachine.hasErrorTitle,
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
        id="pickMachine.index"
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={machineOptions(currentMachineList as MachineDto[])}
      />
      {machineId.length === 0 && isSelected ? (
        <InputError errorMessage={formatMessage(error.requiredValidMachine)} />
      ) : null}
    </div>
  )
}
