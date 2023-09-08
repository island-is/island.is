import { useRouteError } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'

interface ModuleErrorScreenProps {
  name: string | MessageDescriptor
}

export const ModuleErrorScreen = ({ name }: ModuleErrorScreenProps) => {
  const error = useRouteError()

  return (
    <Box paddingY={8} paddingX={[0, 8]}>
      <Problem error={error as Error} expand noBorder />
    </Box>
  )
}
