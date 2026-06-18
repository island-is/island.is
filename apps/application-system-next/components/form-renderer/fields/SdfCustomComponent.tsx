import { CustomComponentRenderer } from '../CustomComponentRenderer'
import type { FieldRendererProps } from '../types'

export const SdfCustomComponent = ({
  component,
  onAnswerChange,
}: FieldRendererProps) => {
  const componentName = component.componentName as string

  return (
    <CustomComponentRenderer
      componentName={componentName}
      // Server-resolved id (dynamic `(application, user) => string` ids are
      // resolved when the screen DTO is built). Passed as a flat prop, outside
      // the template-controlled `props`.
      id={component.id}
      rawProps={component.props ?? '{}'}
      onAnswerChange={onAnswerChange}
    />
  )
}
