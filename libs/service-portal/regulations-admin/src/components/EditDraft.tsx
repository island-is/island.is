import React, { Fragment } from 'react'

import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { RegulationDraft } from '@island.is/regulations/admin'
import { EditBasics } from '../components/EditBasics'
import { EditMeta } from '../components/EditMeta'
import { EditSignature } from '../components/EditSignature'
import { EditImpacts } from '../components/EditImpacts'
import { EditReview } from '../components/EditReview'
import { editorMsgs } from '../messages'
import { Step } from '../types'
import { ButtonBar } from '../components/ButtonBar'
import { SaveDeleteButtons } from '../components/SaveDeleteButtons'
import { useDraftingState, StepComponent } from '../state/useDraftingState'
import { MessageDescriptor } from 'react-intl'
import { DraftingNotes } from '../components/DraftingNotes'
import { useLocale } from '../utils'
import { RegulationMinistryList } from '@island.is/regulations/web'

// ---------------------------------------------------------------------------

const stepData: Record<
  Step,
  {
    title: MessageDescriptor
    intro?: MessageDescriptor
    Component: StepComponent
  }
> = {
  basics: {
    title: editorMsgs.stepContentHeadline,
    Component: EditBasics,
  },
  meta: {
    title: editorMsgs.stepMetaHeadline,
    Component: EditMeta,
  },
  signature: {
    title: editorMsgs.stepSignatureHeadline,
    intro: editorMsgs.stepSignatureIntro,
    Component: EditSignature,
  },
  impacts: {
    title: editorMsgs.stepImpactHeadline,
    intro: editorMsgs.stepImpactIntro,
    Component: EditImpacts,
  },
  review: {
    title: editorMsgs.stepReviewHeadline,
    intro: editorMsgs.stepReviewIntro,
    Component: EditReview,
  },
}

// ---------------------------------------------------------------------------

type EditDraftProps = {
  draft: RegulationDraft
  stepName: Step
  ministries: RegulationMinistryList
}

const EditDraft = (props: EditDraftProps) => {
  const t = useLocale().formatMessage
  const { state, stepNav, actions } = useDraftingState(
    props.draft,
    props.ministries,
    props.stepName,
  )
  const { draft, stepName, saving } = state
  const { id } = draft

  const step = stepData[stepName]

  return (
    <Fragment key={id}>
      <Box marginBottom={[2, 2, 4]}>
        <Text as="h1" variant="h1">
          {t(step.title)}
        </Text>
        {step.intro && (
          <Text as="p" marginTop={1}>
            {t(step.intro)}
          </Text>
        )}
      </Box>

      <SaveDeleteButtons draft={draft} saving={saving} actions={actions} wrap />

      {draft ? (
        <step.Component actions={actions} draft={draft} />
      ) : (
        <SkeletonLoader height={120} repeat={2} space={3} />
      )}

      {draft && (
        <DraftingNotes
          draft={draft}
          onChange={(text) => {
            actions.updateState('draftingNotes', text)
          }}
        />
      )}

      <ButtonBar id={id} stepNav={stepNav} actions={actions} />
    </Fragment>
  )
}

export default EditDraft
