import React from 'react'
import {
  getCustomComponent,
  isCustomComponentWriteAllowed,
  validateCustomComponentProps,
} from '../registry'

export const CustomComponentRenderer = ({
  componentName,
  rawProps,
  onAnswerChange,
}: {
  componentName: string
  rawProps: string
  onAnswerChange: (fieldId: string, value: unknown) => void
}) => {
  const { component: Component } = getCustomComponent(componentName)
  const { parsed } = validateCustomComponentProps(componentName, rawProps)
  const allowWrites = isCustomComponentWriteAllowed(componentName)

  const DynComponent = Component as React.ComponentType<Record<string, unknown>>

  return (
    <DynComponent
      componentName={componentName}
      onAnswerChange={allowWrites ? onAnswerChange : undefined}
      {...parsed}
    />
  )
}
