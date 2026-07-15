import { Box } from '@island.is/island-ui/core'
import { CustomComponentRenderer } from '../CustomComponentRenderer'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfCustomComponent = ({
  component,
  onAnswerChange,
}: FieldRendererProps) => {
  const componentName = component.componentName as string

  return (
    <Box {...getSdfFieldMargins(component)}>
      <CustomComponentRenderer
        componentName={componentName}
        // Server-resolved id (dynamic `(application, user) => string` ids are
        // resolved when the screen DTO is built). Passed as a flat prop, outside
        // the template-controlled `props`.
        id={component.id}
        rawProps={component.props ?? '{}'}
        onAnswerChange={onAnswerChange}
      />
    </Box>
  )
}
