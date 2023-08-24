import { useRouteError } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'

import { ErrorBox } from '@island.is/portals/core'
import { Box } from '@island.is/island-ui/core'

interface ModuleErrorScreenProps {
  name: string | MessageDescriptor
}

export const ModuleErrorScreen = ({ name }: ModuleErrorScreenProps) => {
  const error = useRouteError()

  return (
    <Box padding={8}>
      <ErrorBox error={error as Error} moduleName={name}></ErrorBox>
    </Box>
  )
}
