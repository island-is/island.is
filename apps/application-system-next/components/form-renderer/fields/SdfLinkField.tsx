import { Box, LinkV2 } from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

export const SdfLinkField = ({ component }: FieldRendererProps) => (
  <Box marginBottom={2}>
    <LinkV2
      href={component.url ?? '#'}
      newTab
      color="blue400"
      underline="normal"
    >
      {component.label}
    </LinkV2>
  </Box>
)
