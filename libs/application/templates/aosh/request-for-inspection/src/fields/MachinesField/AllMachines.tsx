import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { FindAllMachines } from './FindAllMachines'

export const AllMachinesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  return (
    <Box paddingTop={2}>
      <FindAllMachines {...props} />
    </Box>
  )
}
