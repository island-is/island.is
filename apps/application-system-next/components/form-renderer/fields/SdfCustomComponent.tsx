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
      rawProps={component.props ?? '{}'}
      onAnswerChange={onAnswerChange}
    />
  )
}
