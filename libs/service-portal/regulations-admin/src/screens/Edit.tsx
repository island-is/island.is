import React from 'react'
import { useParams } from 'react-router-dom'

import { useNamespaces } from '@island.is/localization'
import { RegulationDraftId } from '@island.is/regulations/admin'
import { isUuid } from 'uuidv4'
import { Step } from '../types'
import { steps } from '../state/useDraftingState'
import EditDraft from '../components/EditDraft'
import { useMinistriesQuery, useRegulationDraftQuery } from '../utils/dataHooks'

// ---------------------------------------------------------------------------

const ensureStep = (maybeStep?: string): Step => {
  if (!maybeStep) {
    return 'basics'
  }
  if (maybeStep in steps) {
    return maybeStep as Step
  }
  throw new Error('Invalid RegulationDraft editing Step')
}

const ensureDraftId = (maybeId: string): RegulationDraftId => {
  if (isUuid(maybeId)) {
    return maybeId as RegulationDraftId
  }
  throw new Error('Invalid RegulationDraft editing Id')
}

// ---------------------------------------------------------------------------

const Edit = () => {
  useNamespaces('ap.regulations-admin')
  const params = useParams<{ id: string; step?: string }>()
  const id = ensureDraftId(params.id)
  const stepName = ensureStep(params.step)

  const draft = useRegulationDraftQuery(id)
  const ministries = useMinistriesQuery()

  if (draft.loading || ministries.loading) {
    return <p>Loading...</p>
  }

  if (draft.error) {
    throw new Error(`Regulation ${id} not found`)
  }
  if (ministries.error) {
    throw ministries.error
  }

  return (
    <EditDraft
      key={id}
      draft={draft.data}
      stepName={stepName}
      ministries={ministries.data}
    />
  )
}

export default Edit
