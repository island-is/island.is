import { Box, LinkV2 } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfLinkField = ({ component }: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
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
