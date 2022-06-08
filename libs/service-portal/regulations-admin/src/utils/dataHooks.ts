import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Query } from '@island.is/api/schema'
import { gql, useQuery, useMutation, ApolloError } from '@apollo/client'
import {
  DraftImpact,
  DraftImpactName,
  ImageSourceMap,
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
import { fileToObject, UploadFile } from '@island.is/island-ui/core'
import { createHash } from 'crypto'

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

const UploadImageUrlsMutation = gql`
  mutation UploadImageUrlsMutation($input: UploadImageUrlsInput!) {
    uploadImageUrls(input: $input)
  }
`

export const useUploadImageUrls = () => {
  const [uploadNewImageUrls] = useMutation(UploadImageUrlsMutation)
  const [UploadErrorMessage, setUploadErrorMessage] = useState<string>()

  const uploadImageUrls = async (
    urls: Array<string>,
    regId: string,
  ): Promise<ImageSourceMap> => {
    try {
      const post = await uploadNewImageUrls({
        variables: {
          input: {
            regId,
            urls,
          },
        },
      })
      console.log(post)
      return post.data?.uploadImageUrls
    } catch (error) {
      setUploadErrorMessage("Couldn't upload images")
      return [{ oldUrl: '', newUrl: '' }]
    }
  }

  return {
    UploadErrorMessage,
    uploadImageUrls,
  }
}

// ---------------------------------------------------------------------------
const CreatePresignedPostMutation = gql`
  3
`

export const useS3Upload = () => {
  const [createNewPresignedPost] = useMutation(CreatePresignedPostMutation)
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>()
  const [uploadFile, setUploadFile] = useState<UploadFile>()
  const [uploadLocation, setUploadLocation] = useState<string>()

  const createFormData = (
    presignedPost: PresignedPost,
    file?: UploadFile,
  ): FormData => {
    const formData = new FormData()
    Object.keys(presignedPost.fields).forEach((key) => {
      formData.append(key, presignedPost.fields[key])
    })
    if (file) {
      formData.append('file', file as File)
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
            hash,
          },
        },
      })

      return post.data?.createPresignedPost
    } catch (error) {
      setUploadErrorMessage("Couldn't create presigned post!")
      return { url: '', fields: {} }
    }
  }

  const uploadToS3 = async (
    file?: UploadFile,
    presignedPost?: PresignedPost,
  ) => {
    if (!presignedPost || !file) {
      return
    }

    const formData = createFormData(presignedPost, file)

    file.status = 'uploading'
    setUploadFile(file)

    return fetch(presignedPost.url, {
      body: formData,
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
      },
    }).then(
      () => {
        file.status = 'done'
        const loc = `${presignedPost.url}/${file.key}`
        setUploadLocation(loc)
        setUploadFile(file)
      },
      () => {
        file.status = 'error'
        setUploadFile(file)
      },
    )
  }

  const deleteFromS3 = async (presignedPost: PresignedPost) => {
    console.log('not implemented')
    /*const formData = createFormData(presignedPost)
    const res = await fetch(presignedPost.url, {
      body: formData,
      method: 'DELETE',
      mode: 'cors',
    })*/
  }

  const onChange = async (newFiles?: File[], regId?: string) => {
    setUploadErrorMessage(undefined)

    if (!newFiles?.length || !regId) {
      return
    }

    const newFile = newFiles[0]
    const hash = await getHash(newFile)
    const file = newFiles[0] as UploadFile
    const presignedPost = await createPresignedPost(file.name, regId, hash)

    if (!presignedPost) {
      return
    }
    file.key = presignedPost.fields.key
    setUploadFile(file)

    uploadToS3(file, presignedPost)
  }

  const onRetry = (regId?: string) => {
    setUploadErrorMessage(undefined)
    onChange([uploadFile as File], regId)
  }

  const onRemove = async (file?: UploadFile, regId?: string) => {
    /*setUploadErrorMessage(undefined)

    if (!file || !regId) {
      return
    }

    const hash = await getHash(file)
    const file = newFiles[0] as UploadFile
    const presignedPost = await createPresignedPost(file.name, regId, hash)

    if (!presignedPost) {
      return
    }

    deleteFromS3(presignedPost)*/
  }
  return {
    uploadFile,
    uploadErrorMessage,
    uploadLocation,
    onChange,
    onRemove,
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
