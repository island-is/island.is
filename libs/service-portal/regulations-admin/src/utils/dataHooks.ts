import { useState } from 'react'
import { useHistory } from 'react-router'
import { Query } from '@island.is/api/schema'
import {
  gql,
  useQuery,
  useMutation,
  ApolloError,
  useLazyQuery,
} from '@apollo/client'
import {
  DraftImpact,
  DraftImpactName,
  PresignedPost,
  RegulationDraft,
  TaskListType,
} from '@island.is/regulations/admin'
import {
  ISODate,
  LawChapter,
  MinistryList,
  nameToSlug,
  RegName,
  Regulation,
  RegulationOptionList,
} from '@island.is/regulations'
import { ShippedSummary } from '@island.is/regulations/admin'
import { getEditUrl } from './routing'

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

const CreatePresignedPostMutation = gql`
  mutation CreatePresignedPost {
    createPresignedPost
  }
`

export const useS3Upload = () => {
  type CreateStatus =
    | { creating: boolean; error?: never; data?: never }
    | { creating?: false; error: Error; data?: never }
    | { creating?: false; error?: never; data: PresignedPost }

  const [status, setStatus] = useState<CreateStatus>({ creating: false })
  const [createNewPresignedPost] = useMutation(CreatePresignedPostMutation)

  return {
    ...status,

    createPresignedPost: () => {
      console.log(`status: ${status}`)
      if (status.creating) {
        return
      }
      setStatus({ creating: true })
      createNewPresignedPost()
        .then((res) => {
          const presignedPost = res.data
            ? (res.data.createPresignedPost as PresignedPost)
            : undefined
          if (!presignedPost) {
            throw new Error('Presigned post not created')
          }

          setStatus({ creating: false, data: presignedPost })
        })
        .catch((e) => {
          const error = e instanceof Error ? e : new Error(String(e))
          setStatus({ error })
        })
    },
  }
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

const RegulationImpactsQuery = gql`
  query regulationImpactsByName($input: GetRegulationImpactsInput!) {
    getRegulationImpactsByName(input: $input)
  }
`

export const useGetRegulationImpactsQuery = (
  regulation: string,
): QueryResult<DraftImpact[]> => {
  const { loading, error, data } = useQuery(RegulationImpactsQuery, {
    variables: {
      input: { regulation: nameToSlug(regulation as RegName) },
    },
    fetchPolicy: 'no-cache',
  })

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching impacts for "${regulation}"`),
    }
  }
  return {
    data: data.getRegulationImpactsByName as DraftImpact[],
  }
}

// ---------------------------------------------------------------------------

const ShippedRegulationsQuery = gql`
  query ShippedRegulationsQuery {
    getShippedRegulations {
      id
      draftingStatus
      title
      idealPublishDate
      name
    }
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
/*
// FIXME: Return error: "GraphQLError: Expected Iterable, but did not find one for field \"Query.getDraftRegulations\".
const RegulationTaskListQuery = gql`
  query RegulationTaskListQuery($input: GetDraftRegulationsInput!) {
    getDraftRegulations(input: $input) {
      drafts {
        id
        draftingStatus
        authors {
          authorId
          name
        }
        title
        idealPublishDate
        fastTrack
      }
      paging {
        page
        pages
      }
    }
  }
`
*/
const RegulationTaskListQuery = gql`
  query RegulationTaskListQuery($input: GetDraftRegulationsInput!) {
    getDraftRegulations(input: $input)
  }
`

export const useRegulationTaskListQuery = (
  page = 1,
): QueryResult<TaskListType> => {
  const { loading, error, data } = useQuery(RegulationTaskListQuery, {
    variables: {
      input: { page },
    },
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
    data: data.getDraftRegulations as TaskListType,
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

// ---------------------------------------------------------------------------

const GetRegulationFromApiQuery = gql`
  query GetRegulationFromApi($input: GetRegulationFromApiInput!) {
    getRegulationFromApi(input: $input)
  }
`

export const useGetRegulationFromApiQuery = (
  regulation: RegName | DraftImpactName,
  date?: ISODate,
): QueryResult<Regulation> => {
  const { loading, error, data } = useQuery<Query>(GetRegulationFromApiQuery, {
    variables: { input: { regulation, date } },
  })

  if (loading) {
    return { loading }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching regulation`),
    }
  }
  // TODO: handle RegulationRedirect?
  if ('redirectUrl' in data.getRegulationFromApi) {
    return {
      error: new Error(`redirect`),
    }
  }
  return {
    data: data.getRegulationFromApi as Regulation,
  }
}
