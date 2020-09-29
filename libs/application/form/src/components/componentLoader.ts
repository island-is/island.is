import * as components from './fields'
import {
  CustomFieldComponents,
  FieldComponents,
} from '@island.is/application/template'
import { FC } from 'react'
import { FieldComponentProps } from '../types'

export function getComponentByName(
  componentName: FieldComponents | CustomFieldComponents,
): unknown | null {
  return (
    (components as Record<string, FC<FieldComponentProps>>)[componentName] ||
    null
  )
}
