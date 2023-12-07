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
import { information, error } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyMachineDetails } from '../../hooks/useLazyMachineDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

interface MachineSearchFieldProps {
  currentMachineList: MachineHateoasDto[]
}

export const MachineSelectField: FC<
  React.PropsWithChildren<MachineSearchFieldProps & FieldBaseProps>
> = ({ currentMachineList, application, errors, setFieldLoadingState }) => {
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
    useState<MachineHateoasDto | null>(
      currentMachine && currentMachine.registrationNumber
        ? currentMachine
        : null,
    )
  const [machineId, setMachineId] = useState<string>(
    getValueViaPath(application.answers, 'pickMachine.id', '') as string,
  )

  const getMachineDetails = useLazyMachineDetails()
  const getMachineDetailsCallback = useCallback(
    async (id: string) => {
      const { data } = await getMachineDetails({
        id: id,
      })
      return data
    },
    [getMachineDetails],
  )

  function isCurrentMachineDisabled(
    machine: MachineHateoasDto | null,
  ): boolean {
    return !machine?.links?.some((link) => link?.rel === 'ownerChange')
  }

  const onChange = (option: Option) => {
    const currentMachine = currentMachineList[parseInt(option.value, 10)]
    setIsLoading(true)
    setSelected(true)
    if (currentMachine.id) {
      getMachineDetailsCallback(currentMachine.id)
        .then((response) => {
          setSelectedMachine(response.aoshMachineDetails)

          setValue(
            'machine.regNumber',
            response.aoshMachineDetails.registrationNumber,
          )
          setValue('machine.category', response.aoshMachineDetails.category)
          const [type, ...subType] =
            currentMachine.type?.split(' - ') ||
            response.aoshMachineDetails.type?.split(' ') ||
            []

          setValue('machine.type', type || '')
          setValue('machine.subType', subType.join() || '')
          setValue(
            'machine.plate',
            response.aoshMachineDetails.licensePlateNumber || '',
          )
          setValue(
            'machine.ownerNumber',
            response.aoshMachineDetails.ownerNumber || '',
          )
          setValue('machine.id', response.aoshMachineDetails.id)
          setValue('machine.date', new Date().toISOString())
          setValue(
            'pickMachine.isValid',
            isCurrentMachineDisabled(response.aoshMachineDetails)
              ? undefined
              : true,
          )
          setMachineId(currentMachine?.id || '')
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    }
  }
  // Use this when Links have been added to machine

  useEffect(() => {
    setFieldLoadingState?.(isLoading)
  }, [isLoading])

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickMachine.vehicle)}
        id="pickMachine.id"
        name="pickMachine.id"
        onSelect={(option) => onChange(option as Option)}
        options={currentMachineList.map((machine, index) => {
          return {
            value: index.toString(),
            label: `${machine.type}` || '',
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
              <CategoryCard
                colorScheme={
                  isCurrentMachineDisabled(selectedMachine) ? 'red' : 'blue'
                }
                heading={selectedMachine.registrationNumber || ''}
                text={`${selectedMachine.type}`}
              />
            )}
            {selectedMachine && isCurrentMachineDisabled(selectedMachine) && (
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
