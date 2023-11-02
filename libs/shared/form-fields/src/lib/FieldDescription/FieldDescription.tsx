import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
interface Props {
  description: string
}

export const FieldDescription: FC<React.PropsWithChildren<Props>> = ({
  description,
}) => {
  return (
    <Box marginTop={1} marginBottom={1}>
      <Markdown>{description}</Markdown>
    </Box>
  )
}

export default FieldDescription
