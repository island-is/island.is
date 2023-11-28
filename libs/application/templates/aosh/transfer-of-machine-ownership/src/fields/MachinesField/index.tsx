import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { MachineSelectField } from './MachineSelectField'
import { MachineRadioField } from './MachineRadioField'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

export const MachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props

  const currentMachineList = application?.externalData.machinesList
    .data as MachineHateoasDto[]

  return (
    <Box paddingTop={2}>
      {currentMachineList.length > 5 ? (
        <MachineSelectField
          currentMachineList={currentMachineList}
          {...props}
        />
      ) : (
        <MachineRadioField currentMachineList={currentMachineList} {...props} />
      )}
    </Box>
  )
}
