import { useState } from 'react'
import { generatePath, useHistory } from 'react-router'
import { Query } from '@island.is/api/schema'
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client'
import { RegulationDraft } from '@island.is/regulations/admin'
import {
  RegulationLawChapter,
  RegulationMinistryList,
} from '@island.is/regulations/web'
import { ServicePortalPath } from '@island.is/service-portal/core'

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
      input: {
        regulationId: draftId,
      },
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

const MinistriesQuery = gql`
  query DraftRegulationMinistriesQuery {
    getDraftRegulationsMinistries
  }
`

export const useMinistriesQuery = (): QueryResult<RegulationMinistryList> => {
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
    data: data.getDraftRegulationsMinistries as RegulationMinistryList,
  }
}

// ---------------------------------------------------------------------------

const LawChaptersQuery = gql`
  query DraftRegulationsLawChaptersQuery {
    getDraftRegulationsLawChapters
  }
`

export const useLawChaptersQuery = (): QueryResult<
  Array<RegulationLawChapter>
> => {
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
    data: data.getDraftRegulationsLawChapters as Array<RegulationLawChapter>,
  }
}

// ---------------------------------------------------------------------------

const CREATE_DRAFT_REGULATION_MUTATION = gql`
  mutation CreateDraftRegulationMutation($input: CreateDraftRegulationInput!) {
    createDraftRegulation(input: $input)
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
          history.push(
            generatePath(ServicePortalPath.RegulationsAdminEdit, {
              id: newDraft.id,
            }),
          )
        })
        .catch((e) => {
          const error = e instanceof Error ? e : new Error(String(e))
          setStatus({ error })
        })
    },
  }
}
