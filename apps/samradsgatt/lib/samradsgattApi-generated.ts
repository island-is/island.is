import { emptySplitApi as api } from './baseApi'
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getApiAdvice: build.query<GetApiAdviceApiResponse, GetApiAdviceApiArg>({
      query: () => ({ url: `/api/Advice` }),
    }),
    postApiAdvice: build.mutation<
      PostApiAdviceApiResponse,
      PostApiAdviceApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Advice`,
        method: 'POST',
        body: queryArg.postAdvice,
      }),
    }),
    getApiCase: build.query<GetApiCaseApiResponse, GetApiCaseApiArg>({
      query: () => ({ url: `/api/Case` }),
    }),
    getApiCaseByCaseId: build.query<
      GetApiCaseByCaseIdApiResponse,
      GetApiCaseByCaseIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/Case/${queryArg.caseId}` }),
    }),
    getApiCaseByCaseIdAdvices: build.query<
      GetApiCaseByCaseIdAdvicesApiResponse,
      GetApiCaseByCaseIdAdvicesApiArg
    >({
      query: (queryArg) => ({ url: `/api/Case/${queryArg.caseId}/Advices` }),
    }),
    postApiCaseByCaseIdSubscribe: build.mutation<
      PostApiCaseByCaseIdSubscribeApiResponse,
      PostApiCaseByCaseIdSubscribeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Case/${queryArg.caseId}/Subscribe`,
        method: 'POST',
      }),
    }),
    postApiCaseByCaseIdUnsubscribe: build.mutation<
      PostApiCaseByCaseIdUnsubscribeApiResponse,
      PostApiCaseByCaseIdUnsubscribeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Case/${queryArg.caseId}/Unsubscribe`,
        method: 'POST',
      }),
    }),
    getApiDocumentByDocumentId: build.query<
      GetApiDocumentByDocumentIdApiResponse,
      GetApiDocumentByDocumentIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/Document/${queryArg.documentId}` }),
    }),
    getApiSubscription: build.query<
      GetApiSubscriptionApiResponse,
      GetApiSubscriptionApiArg
    >({
      query: () => ({ url: `/api/Subscription` }),
    }),
    postApiSubscription: build.mutation<
      PostApiSubscriptionApiResponse,
      PostApiSubscriptionApiArg
    >({
      query: (queryArg) => ({
        url: `/api/Subscription`,
        method: 'POST',
        body: queryArg.postSubscriptions,
      }),
    }),
  }),
  overrideExisting: false,
})
export { injectedRtkApi as samradsgattApi }
export type GetApiAdviceApiResponse = /** status 200 Success */ number
export type GetApiAdviceApiArg = void
export type PostApiAdviceApiResponse = /** status 200 Success */ number
export type PostApiAdviceApiArg = {
  postAdvice: PostAdvice
}
export type GetApiCaseApiResponse = /** status 200 Success */ CaseItemResponse[]
export type GetApiCaseApiArg = void
export type GetApiCaseByCaseIdApiResponse = /** status 200 Success */ CaseResponse
export type GetApiCaseByCaseIdApiArg = {
  caseId: number
}
export type GetApiCaseByCaseIdAdvicesApiResponse = /** status 200 Success */ AdviceResponse[]
export type GetApiCaseByCaseIdAdvicesApiArg = {
  caseId: number
}
export type PostApiCaseByCaseIdSubscribeApiResponse = /** status 200 Success */ number
export type PostApiCaseByCaseIdSubscribeApiArg = {
  caseId: number
}
export type PostApiCaseByCaseIdUnsubscribeApiResponse = /** status 200 Success */ number
export type PostApiCaseByCaseIdUnsubscribeApiArg = {
  caseId: number
}
export type GetApiDocumentByDocumentIdApiResponse = /** status 200 Success */ number
export type GetApiDocumentByDocumentIdApiArg = {
  documentId: number
}
export type GetApiSubscriptionApiResponse = /** status 200 Success */ number
export type GetApiSubscriptionApiArg = void
export type PostApiSubscriptionApiResponse = /** status 200 Success */ number
export type PostApiSubscriptionApiArg = {
  postSubscriptions: PostSubscriptions
}
export type PostAdvice = {
  caseId?: string | null
  adviceData?: string | null
}
export type CaseItemResponse = {
  id?: number
  caseNumber?: string | null
  name?: string | null
  adviceCount?: number
  shortDescription?: string | null
  status?: string | null
  institution?: string | null
  type?: string | null
  policyArea?: string | null
  processBegins?: string
  processEnds?: string
  created?: string
}
export type CaseResponse = {
  id?: number
  caseNumber?: string | null
  name?: string | null
  shortDescription?: string | null
  detailedDescription?: string | null
  contactName?: string | null
  contactEmail?: string | null
  status?: string | null
  institution?: string | null
  type?: string | null
  policyArea?: string | null
  processBegins?: string
  processEnds?: string
  announcementText?: string | null
  summaryDate?: string | null
  summaryText?: string | null
  adviceCount?: number
  created?: string
  changed?: string
  oldInstitutionName?: string | null
}
export type AdviceResponse = {
  id?: string
  number?: number
  participantName?: string | null
  participantEmail?: string | null
  content?: string | null
  created?: string
}
export type PostSubscriptions = {
  caseIds?: number[] | null
  institutionIds?: number[] | null
  policyAreaIds?: number[] | null
}
export const {
  useGetApiAdviceQuery,
  usePostApiAdviceMutation,
  useGetApiCaseQuery,
  useGetApiCaseByCaseIdQuery,
  useGetApiCaseByCaseIdAdvicesQuery,
  usePostApiCaseByCaseIdSubscribeMutation,
  usePostApiCaseByCaseIdUnsubscribeMutation,
  useGetApiDocumentByDocumentIdQuery,
  useGetApiSubscriptionQuery,
  usePostApiSubscriptionMutation,
} = injectedRtkApi
