import { MessageDescriptor } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { Problem, m } from '@island.is/react-spa/shared'
import { useLocale } from '@island.is/localization'

interface NotFoundProps {
  title?: string | MessageDescriptor
}

export const NotFound = ({ title }: NotFoundProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginY={6} marginX={[0, 6]}>
      <Problem
        tag={formatMessage(m.error)}
        type="not_found"
        expand
        title={formatMessage(title || m.notFound)}
        noBorder
      />
    </Box>
  )
}
