import { Request } from 'express'
import * as kennitala from 'kennitala'
import { isNumericCharacter } from '@island.is/shared/utils'

/**
 * Returns the first occurance of a valid kennitala, if found, null otherwise
 * TODO: also parse numeric id of length 5 on dev/staging environments
 *
 * @param xRoadClient Example IS/GOV/1122334560/something
 * @returns Example 1122334560
 */
export const parseNationalIdFromXRoadClient = (
  xRoadClient: string,
): string | null => {
  const characters = xRoadClient.split('')
  const candidates: string[] = []

  let currentCandidateIndex = 0
  let lastCharacterWasNumeric = false

  for (const character of characters) {
    if (isNumericCharacter(character)) {
      if (candidates[currentCandidateIndex] === undefined) {
        candidates[currentCandidateIndex] = ''
      }

      candidates[currentCandidateIndex] += character
      lastCharacterWasNumeric = true
    } else {
      if (lastCharacterWasNumeric) {
        currentCandidateIndex += 1
      }

      lastCharacterWasNumeric = false
    }
  }

  return (
    candidates.find(
      (candidate) => candidate.length === 10 && kennitala.isValid(candidate),
    ) ?? null
  )
}

export const parseXRoadClientNationalIdFromRequest = (
  request: Request,
): string | null => {
  const xRoadClient = request.headers['x-road-client'] as string | undefined

  return typeof xRoadClient === 'string'
    ? parseNationalIdFromXRoadClient(xRoadClient)
    : null
}
