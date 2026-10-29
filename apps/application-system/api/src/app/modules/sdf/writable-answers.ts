import omitBy from 'lodash/omitBy'
import pickBy from 'lodash/pickBy'
import toPath from 'lodash/toPath'

import type { ReadWriteValues } from '@island.is/application/types'

/**
 * Whether `write` allows the answer key `key`: `'all'` allows every key;
 * otherwise the key's first path segment (`applicant` for `applicant.phone`
 * or `applicant[0]`) must be listed in `write.answers`.
 */
export const isAnswerKeyWritable = (
  write: ReadWriteValues | undefined,
  key: string,
): boolean => write === 'all' || (write?.answers ?? []).includes(toPath(key)[0])

/**
 * Splits `answers` into the entries `write` allows and the rest, by
 * `isAnswerKeyWritable`.
 */
export const splitWritableAnswers = (
  write: ReadWriteValues | undefined,
  answers: Record<string, unknown> | undefined,
): {
  writable: Record<string, unknown>
  forbidden: Record<string, unknown>
} => {
  const isWritable = (_: unknown, key: string) =>
    isAnswerKeyWritable(write, key)
  return {
    writable: pickBy(answers, isWritable),
    forbidden: omitBy(answers, isWritable),
  }
}
