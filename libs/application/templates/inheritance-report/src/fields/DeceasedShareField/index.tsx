import { FieldBaseProps } from '@island.is/application/types'
import { FC, PropsWithChildren } from 'react'

import { Answers } from '../../types'
import DeceasedShare from '../../components/DeceasedShare'
import { Box } from '@island.is/island-ui/core'

export const DeceasedShareField: FC<
  PropsWithChildren<FieldBaseProps<Answers>>
> = ({ field }) => {
  const { id } = field

  return (
    <Box marginTop={2}>
      <DeceasedShare id={id} />
    </Box>
  )
}

export default DeceasedShareField
