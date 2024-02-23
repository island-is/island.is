import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { MachineSelectField } from './MachineSelectField'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'

export const MachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const machineList = application?.externalData.machinesList
    .data as MachinesWithTotalCount
  console.log('machineList', machineList)
  return (
    <Box paddingTop={2}>
      <MachineSelectField
        currentMachineList={machineList.machines}
        {...props}
      />
    </Box>
  )
}
