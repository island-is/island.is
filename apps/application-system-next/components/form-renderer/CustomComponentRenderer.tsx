import React from 'react'
import {
  getCustomComponent,
  isCustomComponentWriteAllowed,
  validateCustomComponentProps,
} from '../registry'

export const CustomComponentRenderer = ({
  componentName,
  id,
  rawProps,
  onAnswerChange,
}: {
  componentName: string
  /** Server-resolved component id (already a plain string). */
  id?: string
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
      id={id}
      onAnswerChange={allowWrites ? onAnswerChange : undefined}
      {...parsed}
    />
  )
}
