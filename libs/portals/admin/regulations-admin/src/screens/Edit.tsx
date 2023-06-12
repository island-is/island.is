import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useLocale, useNamespaces } from '@island.is/localization'
import { DraftImpactId, RegulationDraftId } from '@island.is/regulations/admin'
import { isUuid } from 'uuidv4'
import { RegulationDraftTypes, Step, StepNames } from '../types'

import {
  RegDraftingProvider,
  ensureStepName,
  useDraftingState,
} from '../state/useDraftingState'
import {
  useLawChaptersQuery,
  useMinistriesQuery,
  useRegulationDraftQuery,
} from '../utils/dataHooks'
import { PortalModuleComponent } from '@island.is/portals/core'
import { MessageDescriptor } from '@formatjs/intl'
import { editorMsgs } from '../lib/messages'
import { EditBasics } from '../components/EditBasics'
import { EditMeta } from '../components/EditMeta'
import { EditSignature } from '../components/EditSignature'
import { EditImpacts } from '../components/EditImpacts'
import { EditReview } from '../components/EditReview'
import { EditPublish } from '../components/EditPublish'
import {
  Box,
  GridColumn,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { SaveDeleteButtons } from '../components/SaveDeleteButtons'
import { DraftingNotes } from '../components/DraftingNotes'
import { ButtonBar } from '../components/ButtonBar'

// ---------------------------------------------------------------------------

const assertStep = (maybeStep: string | undefined): Step => {
  const stepName = ensureStepName(maybeStep || StepNames.basics)
  if (stepName) {
    return stepName
  }
  throw new Error('Invalid RegulationDraft editing Step')
}

const assertDraftId = (maybeId: string | undefined): RegulationDraftId => {
  if (typeof maybeId === 'string' && isUuid(maybeId)) {
    return maybeId as RegulationDraftId
  }
  throw new Error('Invalid RegulationDraft editing Id')
}

const assertImpactId = (maybeId: string | undefined): DraftImpactId => {
  if (typeof maybeId === 'string' && maybeId && isUuid(maybeId)) {
    return maybeId as DraftImpactId
  }
  throw new Error('Invalid DraftImpactId')
}

// ---------------------------------------------------------------------------

const stepData: Record<
  Step,
  {
    title: MessageDescriptor
    intro?: MessageDescriptor
    Component: () => ReturnType<FC<React.PropsWithChildren<unknown>>>
  }
> = {
  basics: {
    title: editorMsgs.stepContentHeadline,
    Component: EditBasics,
  },
  signature: {
    title: editorMsgs.stepSignatureHeadline,
    intro: editorMsgs.stepSignatureIntro,
    Component: EditSignature,
  },
  meta: {
    title: editorMsgs.stepMetaHeadline,
    Component: EditMeta,
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
  publish: {
    title: editorMsgs.stepPublishHeadline,
    intro: editorMsgs.stepPublishIntro,
    Component: EditPublish,
  },
}

const EditScreen = () => {
  const t = useLocale().formatMessage
  const { draft, error: errorState, step: stepState } = useDraftingState()
  const step = stepData[stepState.name]

  useEffect(() => {
    if (errorState) {
      const { message, error } = errorState
      console.error(error || message)
      toast.error(t(message))
    }
  }, [errorState, t])

  return (
    <>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box marginBottom={[4, 4, 5]}>
            <Text as="p" marginBottom={[2, 2]}>
              {draft.type.value === RegulationDraftTypes.base
                ? t(editorMsgs.type_base)
                : t(editorMsgs.type_amending)}
            </Text>
            <Text as="h1" variant="h1" paddingBottom={3}>
              {t(step.title)}
            </Text>
            {step.intro && <Text as="p">{t(step.intro)}</Text>}
          </Box>
        </GridColumn>
      </GridRow>

      {stepState.name !== StepNames.publish && <SaveDeleteButtons wrap />}
      <step.Component />
      <DraftingNotes />
      <ButtonBar />
    </>
  )
}

// ---------------------------------------------------------------------------

const EditApp: PortalModuleComponent = ({ userInfo }) => {
  useNamespaces('ap.regulations-admin')

  const params = useParams<Record<string, string | undefined>>()
  const draftId = assertDraftId(params['draftId'])
  const stepName = assertStep(params['stepName'])
  const impactId =
    stepName === StepNames.impacts && params['impact']
      ? assertImpactId(params['impact'])
      : undefined

  const regulationDraft = useRegulationDraftQuery(draftId)
  const ministries = useMinistriesQuery()
  const lawChapters = useLawChaptersQuery()

  if (regulationDraft.loading || ministries.loading || lawChapters.loading) {
    return <p>Hleð viðmóti...</p>
  }

  if (regulationDraft.error) {
    throw new Error(`Regulation ${draftId} not found`)
  }
  if (ministries.error) {
    throw ministries.error
  }
  if (lawChapters.error) {
    throw lawChapters.error
  }

  return (
    <RegDraftingProvider
      regulationDraft={regulationDraft.data}
      activeImpact={impactId}
      stepName={stepName}
      ministries={ministries.data}
      lawChapters={lawChapters.data}
    >
      <EditScreen key={draftId} />
    </RegDraftingProvider>
  )
}

export default EditApp
