import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Query } from '@island.is/api/schema'
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client'
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
  RegulationType,
} from '@island.is/regulations'
import { ShippedSummary } from '@island.is/regulations/admin'
import { getEditUrl } from './routing'
import { createHash } from 'crypto'
import { RegulationDraftTypes, StepNames } from '../types'

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

export const CreatePresignedPostMutation = gql`
  mutation CreatePresignedPostMutation($input: CreatePresignedPostInput!) {
    createPresignedPost(input: $input)
  }
`
export type UploadingState =
  | { uploading: false; error?: string }
  | { uploading: false; error?: never }
  | { uploading: true; error?: never }

export const useS3Upload = () => {
  const [createNewPresignedPost] = useMutation(CreatePresignedPostMutation)
  const [uploadLocation, setUploadLocation] = useState<string>()
  const [uploadStatus, setUploadStatus] = useState<UploadingState>({
    uploading: false,
  })

  const createFormData = (
    presignedPost: PresignedPost,
    file?: File,
  ): FormData => {
    const formData = new FormData()
    Object.keys(presignedPost.fields).forEach((key) => {
      formData.append(key, presignedPost.fields[key])
    })
    if (file) {
      formData.append('file', file)
    }
    return formData
  }

  const getHash = async (file: File) => {
    const fileText = await file.text()
    const hash = createHash('md5').update(fileText).digest('hex').slice(0, 8)
    return hash
  }

  const createPresignedPost = async (
    name: string,
    regId: string,
    hash?: string,
  ): Promise<PresignedPost> => {
    try {
      const post = await createNewPresignedPost({
        variables: {
          input: {
            fileName: name,
            regId: regId,
            hash: hash ?? '',
          },
        },
      })
      return post.data?.createPresignedPost.data
    } catch (error) {
      setUploadStatus({
        uploading: false,
        error: 'Presigned Post creation failed',
      })
      return { url: '', fields: {} }
    }
  }

  const uploadToS3 = async (
    file?: File,
    key?: string,
    presignedPost?: PresignedPost,
  ) => {
    if (!presignedPost || !file) {
      return
    }

    const formData = createFormData(presignedPost, file)

    setUploadStatus({ uploading: true })

    await fetch(presignedPost.url, {
      body: formData,
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        setUploadStatus({
          uploading: false,
          error: `Upload failed: ${res.statusText}`,
        })
        return
      }
      const location = `https://files.reglugerd.is/${key}`
      setUploadLocation(location)
      setUploadStatus({ uploading: false })
    })
  }

  const resetUploadLocation = () => setUploadLocation(undefined)

  const onChange = async (newFiles: File[], regId: string) => {
    setUploadStatus({ uploading: false })

    if (!newFiles?.length) {
      setUploadStatus({ uploading: false, error: 'No file provided' })
      return
    }
    //There should be only one file!
    const file = newFiles[0]
    const hash = await getHash(file)
    const presignedPost = await createPresignedPost(file.name, regId, hash)

    if (!presignedPost) {
      setUploadStatus({
        uploading: false,
        error: `Upload failed: presignedPost creation failed`,
      })
      return
    }
    uploadToS3(file, presignedPost.fields['key'], presignedPost)
  }

  const onRetry = (file: File, regId: string) => {
    onChange([file], regId)
  }

  return {
    uploadLocation,
    uploadStatus,
    createPresignedPost,
    createFormData,
    uploadToS3,
    resetUploadLocation,
    onChange,
    onRetry,
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
  mutation CreateDraftRegulationMutation($input: CreateDraftRegulationInput!) {
    createDraftRegulation(input: $input)
  }
`

type useRegulationProps = {
  regulationType?: RegulationType
}

export const useCreateRegulationDraft = () => {
  type CreateStatus =
    | { creating: boolean; error?: never }
    | { creating?: false; error: Error }

  const [status, setStatus] = useState<CreateStatus>({ creating: false })
  const [createDraftRegulation] = useMutation(CREATE_DRAFT_REGULATION_MUTATION)
  const navigate = useNavigate()

  return {
    ...status,

    createNewDraft: ({ regulationType }: useRegulationProps) => {
      if (status.creating) {
        return
      }
      setStatus({ creating: true })
      createDraftRegulation({
        variables: {
          input: {
            type: regulationType,
          },
        },
      })
        .then((res) => {
          const newDraft = res.data
            ? (res.data.createDraftRegulation as RegulationDraft)
            : undefined
          if (!newDraft) {
            throw new Error('Regulation draft not created (??)')
          }

          setStatus({ creating: false })

          navigate(
            getEditUrl(
              newDraft.id,
              regulationType === RegulationDraftTypes.amending
                ? StepNames.impacts
                : undefined,
            ),
          )
        })
        .catch((e) => {
          const error = e instanceof Error ? e : new Error(String(e))
          setStatus({ error })
        })
    },
  }
}

// ---------------------------------------------------------------------------

export const RegulationSearchListQuery = gql`
  query RegulationsSearchOptionsQuery($input: GetRegulationsSearchInput!) {
    getRegulationsOptionSearch(input: $input)
  }
`

// ---------------------------------------------------------------------------

export const RegulationOptionListQuery = gql`
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
  date?: ISODate | true,
): QueryResult<Regulation | undefined> => {
  const { loading, error, data } = useQuery<Query>(GetRegulationFromApiQuery, {
    variables: {
      input: { regulation, date: date === true ? undefined : date },
    },
  })

  if (loading || date === true) {
    return { loading: true }
  }
  if (!data) {
    return {
      error: error || new Error(`Error fetching regulation`),
    }
  }
  const regulationFromApi = (data.getRegulationFromApi ?? undefined) as
    | Regulation
    | undefined
  if (regulationFromApi && 'redirectUrl' in regulationFromApi) {
    return {
      error: new Error(`redirect`),
    }
  }
  return {
    data: regulationFromApi,
  }
}
