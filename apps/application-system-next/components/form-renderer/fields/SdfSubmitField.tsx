import { Box, Button } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfSubmitField = ({ component }: FieldRendererProps) => (
  <Box
    {...getSdfFieldMargins(component)}
    display="flex"
    flexDirection="row"
    columnGap={2}
  >
    {component.actions?.map((action) => (
      <Button
        key={action.event}
        variant={action.type === 'primary' ? 'primary' : 'ghost'}
        size="default"
      >
        {action.name}
      </Button>
    ))}
  </Box>
)
