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

// Reads an answer key that an EARLIER screen owns. The `application` prop can
// be momentarily stale for those: useCascadeDelete persists corrections via a
// raw updateApplication mutation that bypasses the form reducer, so a deleted
// criterion can still be present in `application.answers` while the live form
// value is already correct. Prefer the form; fall back to answers on first
// load, before the owning screen has registered the key at all.
export const getLiveOrSavedArray = <T>(
  getValues: (name: string) => unknown,
  answers: RecordObject,
  path: string,
): T[] => {
  const live = getValues(path)
  if (Array.isArray(live)) return live as T[]
  return getPathValue<T[]>(answers, path, [])
}
