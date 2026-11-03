import type { FieldBaseProps } from '@island.is/application/types'
import * as applicationUiFields from '@island.is/application/ui-fields'
import type { FC, PropsWithChildren } from 'react'

export type PreviewFieldComponent = FC<PropsWithChildren<FieldBaseProps>>

/**
 * Same lookup keys as `@island.is/application/ui-shell` `FieldProvider`:
 * `{ ...applicationUiFields, ...template getFields overrides }`.
 */
export const mergePreviewFieldRegistry = (
  customFields?: Record<string, PreviewFieldComponent>,
): Record<string, PreviewFieldComponent> => ({
  ...(applicationUiFields as unknown as Record<string, PreviewFieldComponent>),
  ...(customFields ?? {}),
})
