import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { MachineSelectField } from './MachineSelectField'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getSelectedMachine } from '../../utils'

export const MyMachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const {
    application,
    field,
    setSubmitButtonDisabled,
    clearOnChange,
    clearOnChangeDefaultValue,
  } = props
  const machineList = application?.externalData.machinesList
    .data as MachinesWithTotalCount

  const { setValue } = useFormContext()

  const onRadioControllerSelect = (s: string) => {
    const machineDetails = getSelectedMachine(
      application.externalData,
      application.answers,
      s,
    )
    const machineDisabled = machineDetails?.disabled
    setValue(
      `${field.id}.paymentRequiredForOwnerChange`,
      machineDetails?.paymentRequiredForOwnerChange,
    )
    setValue(`${field.id}.regNumber`, machineDetails?.registrationNumber)
    setValue(`${field.id}.category`, machineDetails?.category)
    setValue(`${field.id}.type`, machineDetails?.type || '')
    setValue(`${field.id}.subType`, machineDetails?.subType || '')
    setValue(`${field.id}.plate`, machineDetails?.licensePlateNumber || '')
    setValue(`${field.id}.ownerNumber`, machineDetails?.owner?.number || '')
    setValue(`${field.id}.id`, machineDetails?.id)
    setValue(`${field.id}.isValid`, machineDisabled ? undefined : true)

    setSubmitButtonDisabled?.(false)
  }

  if (machineList.totalCount <= 5) {
    return (
      <Box paddingTop={2}>
        <RadioController
          id="machine.id"
          largeButtons
          backgroundColor="blue"
          onSelect={(value: string) => {
            onRadioControllerSelect(value)
          }}
          options={machineList.machines.map((machine) => {
            return {
              value: machine.id || '',
              label: machine?.regNumber || '',
              subLabel: `${machine.category}: ${machine.type} - ${machine.subType}`,
              disabled: machine?.disabled || false,
              tag: machine?.disabled
                ? {
                    label: machine?.status || '',
                    variant: 'red',
                    outlined: true,
                  }
                : undefined,
            }
          })}
          clearOnChange={clearOnChange}
          clearOnChangeDefaultValue={clearOnChangeDefaultValue}
        />
      </Box>
    )
  } else {
    return (
      <Box paddingTop={2}>
        <MachineSelectField
          currentMachineList={machineList.machines}
          {...props}
        />
      </Box>
    )
  }
}
