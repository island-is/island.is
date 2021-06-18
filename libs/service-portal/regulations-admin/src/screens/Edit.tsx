import React, { FC, Fragment, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { mockDraftRegulations, useMockQuery } from '../_mockData'
import { RegulationDraft } from '../types-api'
import { RegulationDraftId } from '../types-database'
import { HTMLText } from '@island.is/regulations'
import { EditBasics } from './EditBasics'
import { editorMsgs } from '../messages'
import { MessageDescriptor } from 'react-intl'
// import { gql, useQuery } from '@apollo/client'
// import { Query } from '@island.is/api/schema'

// const RegulationDraftQuery = gql`
//   query regulationDraft {
//     regulationDraft {
//       id
//       school
//       programme
//       date
//     }
//   }
// `

const getEmptyDraft = (): RegulationDraft => ({
  id: 0, // falsy id to signify that the draft is, as of yet, unsaved
  draftingStatus: 'draft',
  draftingNotes: '' as HTMLText,
  authors: [],
  title: '',
  text: '' as HTMLText,
  appendixes: [],
  comments: '' as HTMLText,
  ministry: undefined,
  lawChapters: [],
})

// ---------------------------------------------------------------------------

type Step = '1' | '2' | '3' | '4'
type StepComponent = (props: { draft: RegulationDraft }) => ReturnType<FC>

const steps: Record<Step, StepComponent> = {
  '1': EditBasics,
  '2': () => <p>Skref 2</p>,
  '3': () => <p>Skref 3</p>,
  '4': () => <p>Skref 4</p>,
}

const introMsgs: Record<
  Step,
  { title: MessageDescriptor; intro?: MessageDescriptor }
> = {
  1: { title: editorMsgs.step1Headline },
  2: { title: editorMsgs.step2Headline },
  3: { title: editorMsgs.step3Headline },
  4: { title: editorMsgs.step4Headline, intro: editorMsgs.step4Intro },
}

// ---------------------------------------------------------------------------

const assertStep = (maybeStep?: string): Step => {
  if (!maybeStep) {
    return '1'
  }
  if (maybeStep in steps) {
    return maybeStep as Step
  }
  throw new Error('Invalid RegulationDraft editing Step')
}
const assertDraftId = (maybeId: string): 'new' | RegulationDraftId => {
  if (maybeId === 'new') {
    return maybeId
  }
  const id = parseInt(maybeId)
  if (id > 0) {
    return id as RegulationDraftId
  }
  throw new Error('Invalid RegulationDraft editing Id')
}

// ---------------------------------------------------------------------------

const Edit = () => {
  useNamespaces('ap.regulations-admin')
  const { formatMessage } = useLocale()
  const params = useParams<{ id: string; step?: string }>()
  const history = useHistory()
  const id = assertDraftId(params.id)
  const step = assertStep(params.step)

  const isNew = id === 'new'

  const { data, loading } = useMockQuery(
    id !== 'new' && { regulationDraft: mockDraftRegulations[id] },
    id === 'new',
  )
  // const { data, loading } = useQuery<Query>(RegulationDraftQuery, {
  //   variables: { id },
  //   skip: id !== 'new',
  // })

  let regulationDraft = data ? data.regulationDraft : undefined

  const [draft, setDraft] = useState(() =>
    id === 'new' ? getEmptyDraft() : undefined,
  )
  useEffect(() => {
    if (regulationDraft) {
      setDraft(regulationDraft)
    } else if (draft && draft.id) {
      setDraft(getEmptyDraft())
    }
  }, [regulationDraft])

  if (!loading && !draft) {
    throw new Error(`Regulation ${id} not found`)
  }

  const EditorStep = steps[step]
  const txt = introMsgs[step]

  return (
    <Fragment key={id}>
      <Box marginBottom={[2, 2, 4]}>
        <Text as="h1" variant="h1">
          {formatMessage(txt.title)}
        </Text>
        {txt.intro && (
          <Text as="p" marginTop={1}>
            {formatMessage(txt.intro)}
          </Text>
        )}
      </Box>

      {draft ? <EditorStep draft={draft} /> : <SkeletonLoader height={120} />}
    </Fragment>
  )
}

export default Edit
