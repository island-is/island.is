import { DraftImpactId, RegulationDraftId } from '@island.is/regulations/admin'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { generatePath } from 'react-router'
import { isUuid } from 'uuidv4'
import { Step } from '../types'

const { RegulationsAdminEdit } = ServicePortalPath

// ---------------------------------------------------------------------------

export const getImpactUrl = (
  impactId: DraftImpactId,
  draftId?: RegulationDraftId,
) =>
  (draftId ? generatePath(RegulationsAdminEdit, { draftId }) : '') +
  `impacts?impact=${encodeURI(impactId)}`

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
    return generatePath(RegulationsAdminEdit, {
      draftId: draftIdOrStepName,
      stepName,
    })
  }
  return draftIdOrStepName || '.'
}

// ---------------------------------------------------------------------------

export const getHomeUrl = () => ServicePortalPath.RegulationsAdminRoot
