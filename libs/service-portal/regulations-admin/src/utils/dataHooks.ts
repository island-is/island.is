import { useState } from 'react'
import { useHistory } from 'react-router'
import { Query } from '@island.is/api/schema'
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client'
import { RegulationDraft } from '@island.is/regulations/admin'
import {
  LawChapter,
  MinistryList,
  RegName,
  RegulationOptionList,
} from '@island.is/regulations'
import { ShippedSummary, DraftSummary } from '@island.is/regulations/admin'
import { getEditUrl } from './routing'

// import { APPLICATION_APPLICATIONS } from '../../lib/queries/applicationApplications'

type QueryResult<T> =
  | {
      data: T
      loading?: never
      error?: never
    }
  | {
      data?: never
      loading: true
      error?: never
    }
  | {
      data?: never
      loading?: never
      error: ApolloError | Error
    }

// ---------------------------------------------------------------------------

const RegulationDraftQuery = gql`
  query draftRegulations($input: GetDraftRegulationInput!) {
    getDraftRegulation(input: $input)
  }
`

export const useRegulationDraftQuery = (
  draftId: string,
): QueryResult<RegulationDraft> => {
  const { loading, error, data } = useQuery(RegulationDraftQuery, {
    variables: {
      input: { draftId },
    },
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching regulation draft "${draftId}"`),
    }
  }
  return {
    data: data.getDraftRegulation as RegulationDraft,
  }
}

// ---------------------------------------------------------------------------

const ShippedRegulationsQuery = gql`
  query ShippedRegulationsQuery {
    getShippedRegulations
  }
`

export const useShippedRegulationsQuery = (): QueryResult<
  Array<ShippedSummary>
> => {
  const { loading, error, data } = useQuery(ShippedRegulationsQuery, {
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching shipped regulations list`),
    }
  }
  return {
    data: data.getShippedRegulations as Array<ShippedSummary>,
  }
}

// ---------------------------------------------------------------------------

const RegulationTaskListQuery = gql`
  query RegulationTaskListQuery {
    getDraftRegulations
  }
`

export const useRegulationTaskListQuery = (): QueryResult<
  Array<DraftSummary>
> => {
  const { loading, error, data } = useQuery(RegulationTaskListQuery, {
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching shipped regulations list`),
    }
  }
  return {
    data: data.getDraftRegulations as Array<DraftSummary>,
  }
}

// ---------------------------------------------------------------------------

const MinistriesQuery = gql`
  query DraftRegulationMinistriesQuery {
    getDraftRegulationsMinistries
  }
`

export const useMinistriesQuery = (): QueryResult<MinistryList> => {
  const { loading, error, data } = useQuery<Query>(MinistriesQuery)

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching ministry list`),
    }
  }
  return {
    data: data.getDraftRegulationsMinistries as MinistryList,
  }
}

// ---------------------------------------------------------------------------

const LawChaptersQuery = gql`
  query DraftRegulationsLawChaptersQuery {
    getDraftRegulationsLawChapters
  }
`

export const useLawChaptersQuery = (): QueryResult<Array<LawChapter>> => {
  const { loading, error, data } = useQuery<Query>(LawChaptersQuery)

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching law chapters`),
    }
  }
  return {
    data: data.getDraftRegulationsLawChapters as Array<LawChapter>,
  }
}

// ---------------------------------------------------------------------------

const CREATE_DRAFT_REGULATION_MUTATION = gql`
  mutation CreateDraftRegulationMutation {
    createDraftRegulation
  }
`

export const useCreateRegulationDraft = () => {
  type CreateStatus =
    | { creating: boolean; error?: never }
    | { creating?: false; error: Error }

  const [status, setStatus] = useState<CreateStatus>({ creating: false })
  const [createDraftRegulation] = useMutation(CREATE_DRAFT_REGULATION_MUTATION)
  const history = useHistory()

  return {
    ...status,

    createNewDraft: () => {
      if (status.creating) {
        return
      }
      setStatus({ creating: true })
      createDraftRegulation()
        .then((res) => {
          const newDraft = res.data
            ? (res.data.createDraftRegulation as RegulationDraft)
            : undefined
          if (!newDraft) {
            throw new Error('Regulation draft not created (??)')
          }

          setStatus({ creating: false })
          history.push(getEditUrl(newDraft.id))
        })
        .catch((e) => {
          const error = e instanceof Error ? e : new Error(String(e))
          setStatus({ error })
        })
    },
  }
}

// ---------------------------------------------------------------------------

const RegulationOptionListQuery = gql`
  query RegulationOptionList($input: GetRegulationOptionListInput!) {
    getRegulationOptionList(input: $input)
  }
`

export const useRegulationListQuery = (
  names: ReadonlyArray<RegName>,
): QueryResult<RegulationOptionList> => {
  const { loading, error, data } = useQuery<Query>(RegulationOptionListQuery, {
    variables: { input: { names } },
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching regulation`),
    }
  }
  return {
    data: data.getRegulationOptionList as RegulationOptionList,
  }
}
