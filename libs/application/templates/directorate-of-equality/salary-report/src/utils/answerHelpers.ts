import { getValueViaPath } from '@island.is/application/core'
import type { RecordObject } from '@island.is/application/types'

// getValueViaPath<T>'s return type is `T | undefined` even when a
// defaultValue is passed, though it already falls back to it at runtime —
// this narrows that return type properly so call sites don't need a
// trailing `?? defaultValue) as T` just to satisfy the compiler.
export const getPathValue = <T>(
  source: RecordObject,
  path: string,
  defaultValue: T,
): T => getValueViaPath<T>(source, path, defaultValue) ?? defaultValue
