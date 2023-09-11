import { useNavigate } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useLocale } from '@island.is/localization'

import { PortalPaths } from '../lib/paths'
import { m } from '../lib/messages'

interface NotFoundProps {
  title?: string | MessageDescriptor
}

export const NotFound = ({ title }: NotFoundProps) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()

  return (
    <Box marginY={6}>
      <Problem
        tag="404"
        type="not_found"
        expand
        title={formatMessage(title || m.notFound)}
        buttonLink={{
          text: formatMessage(m.backToOverview),
          onClick() {
            navigate(PortalPaths.Root)
          },
        }}
      />
    </Box>
  )
}
