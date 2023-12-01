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
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface MachineSearchFieldProps {
  currentMachineList: MachineHateoasDto[]
}

export const MachineRadioField: FC<
  React.PropsWithChildren<MachineSearchFieldProps & FieldBaseProps>
> = ({ currentMachineList, application, errors }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [machineId, setMachineId] = useState<string>(
    getValueViaPath(application.answers, 'pickMachine.id', '') as string,
  )

  const onRadioControllerSelect = (s: string) => {
    const currentMachine = currentMachineList[parseInt(s, 10)]
    setIsLoading(true)
    setValue('pickMachine.id', currentMachine.id)
    setValue('machine.id', currentMachine.id)
    setValue('machine.category', currentMachine.category)
    setValue('machine.regNumber', currentMachine.registrationNumber)
    const [type, ...subType] =
      currentMachine.type?.split(' - ') || currentMachine.type?.split(' ') || []
    setValue('machine.type', type || '')
    setValue('machine.subType', subType.join() || '')
    setValue('machine.date', new Date().toISOString())
    setValue('machine.test', 'testing')
    setMachineId(currentMachine.id || '')
    setIsLoading(false)
  }

  function isCurrentMachineDisabled(status?: string | null): boolean {
    const disabledStatuses = [
      'Læst',
      'Í skráningarferli',
      'Eigandaskipti í gangi',
      'Umráðamannaskipti í gangi',
      'Afskráð tímabundið',
      'Afskráð endanlega',
    ]
    if (status === undefined || status == null) return true
    if (
      disabledStatuses.includes(status) ||
      status.startsWith(disabledStatuses[0])
    ) {
      return true
    } else {
      return false
    }
  }

  const machineOptions = (machines: MachineHateoasDto[]) => {
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
        options={machineOptions(currentMachineList as MachineHateoasDto[])}
      />
      {machineId.length === 0 && (errors as any)?.machine && (
        <InputError errorMessage={formatMessage(error.requiredValidMachine)} />
      )}
    </div>
  )
}
