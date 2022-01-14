import { RegulationDraftId } from '@island.is/regulations/admin'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { generatePath } from 'react-router'
import { isUuid } from 'uuidv4'
import { Step } from '../types'

const { RegulationsAdminEdit } = ServicePortalPath

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
      id: draftIdOrStepName,
      step: stepName,
    })
  }
  return draftIdOrStepName || '.'
}

// ---------------------------------------------------------------------------

export const getHomeUrl = () => ServicePortalPath.RegulationsAdminRoot
