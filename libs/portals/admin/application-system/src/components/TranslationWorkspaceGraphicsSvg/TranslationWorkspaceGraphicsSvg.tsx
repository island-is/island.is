import type { FC, PropsWithChildren } from 'react'
import * as Graphics from '@island.is/application/assets/graphics'

const isGraphicsComponent = (
  value: unknown,
): value is FC<PropsWithChildren<unknown>> => typeof value === 'function'

/**
 * Maps `imageSvgComponentName` from template introspection (function `name` /
 * `displayName`) to the SVG components exported from application assets.
 */
export const resolveTranslationWorkspaceGraphicsComponent = (
  componentName: string | null | undefined,
): FC<PropsWithChildren<unknown>> | null => {
  if (!componentName) return null
  const byKey = Graphics as unknown as Record<string, unknown>
  const resolved = byKey[componentName]
  if (isGraphicsComponent(resolved)) return resolved
  return null
}
