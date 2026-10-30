import type { NextApiRequest } from 'next'

// The national id is interpolated into the national registry query string, so
// it must be impossible for it to carry query structure of its own: anything
// but ten digits is refused rather than cleaned up, which is what stops a
// caller from appending search parameters of their own and turning a single
// lookup into a bulk search.
//
// Deliberately a format check and not a checksum check: the registry holds
// system national ids (kerfiskennitölur) that fail the checksum and still have
// to be looked up.
const NATIONAL_ID_FORMAT = /^\d{10}$/

/**
 * The national id an api route was asked to look up, or undefined when the
 * request did not name one that can be passed on, which the caller answers
 * with 400.
 */
export const readNationalIdQueryParameter = (
  query: NextApiRequest['query'],
): string | undefined => {
  const value = query.nationalId

  // A missing parameter is undefined and a repeated one is an array; neither
  // is a lookup we can answer.
  if (typeof value !== 'string') {
    return undefined
  }

  const nationalId = value.replace(/[\s-]/g, '')

  return NATIONAL_ID_FORMAT.test(nationalId) ? nationalId : undefined
}
