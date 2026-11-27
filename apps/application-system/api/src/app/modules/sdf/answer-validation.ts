import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import set from 'lodash/set'
import type { ZodIssue } from 'zod'

import { getValueViaPath } from '@island.is/application/core'

type ParseResult =
  | { success: true }
  | { success: false; error: { issues: ZodIssue[] } }

export interface AnswerSchema {
  safeParse: (value: unknown) => ParseResult
}

// How many levels of missing parent objects are filled in to reach the fields
// inside them.
const MAX_PARENT_DEPTH = 5

/** `periods[0].start` as `periods.0.start`, the form zod paths and ids use. */
export const toDotPath = (path: string): string =>
  path.replace(/\[(\d+)\]/g, '.$1')

/** Whether `path` is `id` or something inside it (`files.0.name` is inside `files`). */
export const isAtOrBelow = (path: string, id: string): boolean => {
  const dotPath = toDotPath(path)
  return dotPath === id || dotPath.startsWith(`${id}.`)
}

/** The first of `ids` that `path` is at or below. */
export const owningId = (path: string, ids: string[]): string | undefined =>
  ids.find((id) => isAtOrBelow(path, id))

/**
 * The issues of the schema that belong to the fields `fieldIds`: those at a
 * field or inside it. Zod does not look inside an object that is missing, so
 * it reports one issue at the missing parent (`applicant`) instead of one per
 * field (`applicant.phone`). For such a parent the answers are checked again
 * with the object present and empty, which gives the issues of its fields.
 * A parent that the schema allows to be missing has no issue, so is not filled
 * in.
 */
export const zodIssuesForFields = (
  schema: AnswerSchema,
  answers: unknown,
  fieldIds: string[],
  depth = 0,
): ZodIssue[] => {
  const result = schema.safeParse(answers)
  if (result.success) {
    return []
  }

  const issues: ZodIssue[] = []
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (owningId(path, fieldIds)) {
      issues.push(issue)
      continue
    }

    const isMissingParentOfAField =
      issue.path.length > 0 &&
      get(answers, issue.path) === undefined &&
      fieldIds.some((id) => id.startsWith(`${path}.`))
    if (isMissingParentOfAField && depth < MAX_PARENT_DEPTH) {
      const withParent = cloneDeep(answers)
      set(withParent as object, issue.path, {})
      issues.push(
        ...zodIssuesForFields(schema, withParent, fieldIds, depth + 1).filter(
          (inner) => isAtOrBelow(inner.path.join('.'), path),
        ),
      )
    }
  }
  return issues
}

/**
 * The keys of `sent` whose value differs from the stored answers. An empty
 * string and a missing answer count as the same, since a cleared field is sent
 * as an empty string.
 */
export const changedAnswerKeys = (
  stored: Record<string, unknown>,
  sent: Record<string, unknown>,
): string[] =>
  Object.keys(sent).filter((key) => {
    const before = getValueViaPath(stored, key)
    const after = sent[key]
    return !(isEqual(after, before) || (after === '' && before === undefined))
  })

/** The keys that are not a field of the screen, nor inside or around one. */
export const keysOutsideFields = (
  keys: string[],
  fieldIds: string[],
): string[] =>
  keys.filter(
    (key) =>
      !fieldIds.some((id) => isAtOrBelow(key, id) || isAtOrBelow(id, key)),
  )

/** The keys that at least one of the issue paths is at or below. */
export const keysWithIssues = (paths: string[], keys: string[]): string[] =>
  keys.filter((key) => paths.some((path) => isAtOrBelow(path, key)))
