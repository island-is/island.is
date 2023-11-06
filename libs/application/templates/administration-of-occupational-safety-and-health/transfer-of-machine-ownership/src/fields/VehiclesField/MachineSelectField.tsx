import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  CategoryCard,
  SkeletonLoader,
  InputError,
} from '@island.is/island-ui/core'
import { MachineDetailsInput } from '@island.is/api/schema'
import { information, error } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyMachineDetails } from '../../hooks/useLazyVehicleDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { Machine, MachineDetails } from '../../shared'

interface MachineSearchFieldProps {
  currentMachineList: Machine[]
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

  console.log('application.answers', application.answers)
  const currentMachine = currentMachineList[parseInt(machineValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(
    currentMachine && currentMachine.registrationNumber
      ? {
          id: currentMachine.id,
          registrationNumber: currentMachine.registrationNumber,
          type: currentMachine.type,
          owner: currentMachine.owner,
          supervisor: currentMachine.supervisor,
          status: currentMachine.status,
          category: currentMachine.category,
          ownerNumber: '',
        }
      : null,
  )
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
    const currentMachine = currentMachineList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentMachine.id) {
      getMachineDetailsCallback({
        id: currentMachine.id,
      })
        .then((response) => {
          console.log('response', response)
          setSelectedMachine({
            id: currentMachine.id,
            registrationNumber: currentMachine.registrationNumber,
            type: currentMachine.type,
            owner: currentMachine.owner,
            supervisor: currentMachine.supervisor,
            status: currentMachine.status,
            _links: currentMachine._links,
            category: currentMachine.category,
            ownerNumber: response.machineDetails?.ownerNumber || '',
          })

          const disabled = isCurrentMachineDisabled(selectedMachine?.status)
          console.log('currentVechicle', currentMachine)
          console.log('currentMachine', selectedMachine)

          setValue(
            'machine.regNumber',
            response.machineDetails.registrationNumber,
          )
          setValue('machine.category', response.machineDetails.category)
          setValue(
            'machine.type',
            response.machineDetails?.type?.split(' ')[0].trim() || '',
          )
          setValue(
            'machine.subType',
            response.machineDetails?.type?.split(' ')[1].trim() || '',
          )
          setValue('machine.plate', response.machineDetails.licensePlateNumber)
          setValue('machine.ownerNumber', response.machineDetails.ownerNumber)
          setValue('machine.id', currentMachine.id)

          setPlate(disabled ? '' : currentMachine.registrationNumber || '')
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
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

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickMachine.vehicle)}
        id="machine"
        name="machine"
        onSelect={(option) => onChange(option as Option)}
        options={currentMachineList.map((vehicle, index) => {
          return {
            value: index.toString(),
            label: `${vehicle.type}` || '',
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
                  isCurrentMachineDisabled(selectedMachine?.status)
                    ? 'red'
                    : 'blue'
                }
                heading={selectedMachine.registrationNumber || ''}
                text={`${selectedMachine.type}`}
              />
            )}
            {selectedMachine &&
              isCurrentMachineDisabled(selectedMachine?.status) && (
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
      {regNumber.length === 0 && !isLoading && (errors as any)?.machine && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
