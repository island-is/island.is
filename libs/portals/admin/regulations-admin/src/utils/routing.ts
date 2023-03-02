import { DraftImpactId, RegulationDraftId } from '@island.is/regulations/admin'
import { generatePath } from 'react-router-dom'
import { isUuid } from 'uuidv4'
import { RegulationsAdminPaths } from '../lib/paths'
import { Step } from '../types'

const { RegulationsAdminEditStep, RegulationsAdminEdit } = RegulationsAdminPaths

// ---------------------------------------------------------------------------

type GetEditUrlFn = {
  (stepName: Step): string
  (draftId: RegulationDraftId, stepName?: Step): string
}

export const getEditUrl: GetEditUrlFn = (
  draftIdOrStepName: RegulationDraftId | Step,
  stepName?: Step,
) => {
  if (isUuid(draftIdOrStepName)) {
    const path = stepName ? RegulationsAdminEditStep : RegulationsAdminEdit
    return generatePath(path, {
      draftId: draftIdOrStepName,
      stepName: stepName ?? null,
    })
  }
  return draftIdOrStepName || '.'
}

// ---------------------------------------------------------------------------

export const getHomeUrl = () => RegulationsAdminPaths.RegulationsAdminRoot

// ---------------------------------------------------------------------------

/** Converts a Regulation `name` into a URL path segment
 *
 *  Example: '0123/2020' --> '2020/0123'
 */
export const nameToPath = (regulationName: string, seperator?: string) => {
  const [number, year] = regulationName.split('/')
  return year + (seperator || '/') + number
}

/** Creates a bare task URL for a given Regulation `name`
 *
 *  Example: '0123/2020' --> '/task/2020/0123'
 */
export const taskUrl = (regulationName: string) =>
  '/task/' + nameToPath(regulationName)
