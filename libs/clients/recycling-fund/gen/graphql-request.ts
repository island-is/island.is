import { GraphQLClient } from 'graphql-request'
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
}

export type AccessControl = {
  __typename?: 'AccessControl'
  email?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['ID']
  phone?: Maybe<Scalars['String']>
  recyclingLocation?: Maybe<Scalars['String']>
  recyclingPartner?: Maybe<RecyclingPartner>
  role: AccessControlRole
}

export enum AccessControlRole {
  developer = 'developer',
  recyclingCompany = 'recyclingCompany',
  recyclingCompanyAdmin = 'recyclingCompanyAdmin',
  recyclingFund = 'recyclingFund',
}

export type CreateAccessControlInput = {
  email: Scalars['String']
  name: Scalars['String']
  nationalId: Scalars['String']
  partnerId?: InputMaybe<Scalars['String']>
  phone: Scalars['String']
  recyclingLocation?: InputMaybe<Scalars['String']>
  role: AccessControlRole
}

export type CreateRecyclingPartnerInput = {
  active: Scalars['Boolean']
  address: Scalars['String']
  city: Scalars['String']
  companyId: Scalars['String']
  companyName: Scalars['String']
  email: Scalars['String']
  nationalId: Scalars['String']
  phone: Scalars['String']
  postnumber: Scalars['String']
  website?: InputMaybe<Scalars['String']>
}

export type CreateRecyclingRequestInput = {
  permno: Scalars['String']
}

export type DeleteAccessControlInput = {
  nationalId: Scalars['String']
}

export type Gdpr = {
  __typename?: 'Gdpr'
  createdAt: Scalars['DateTime']
  gdprStatus: Scalars['String']
  nationalId: Scalars['String']
  updatedAt: Scalars['DateTime']
}

export type Mutation = {
  __typename?: 'Mutation'
  createRecyclingRequestAppSys: RequestStatus
  createSkilavottordAccessControl: AccessControl
  createSkilavottordGdpr: Scalars['Boolean']
  createSkilavottordRecyclingPartner: RecyclingPartner
  createSkilavottordRecyclingRequest: RecyclingRequestResponse
  createSkilavottordVehicle: Scalars['Boolean']
  createSkilavottordVehicleAppSys: Scalars['Boolean']
  createSkilavottordVehicleOwner: Scalars['Boolean']
  createSkilavottordVehicleOwnerAppSys: Scalars['Boolean']
  deleteSkilavottordAccessControl: Scalars['Boolean']
  updateSkilavottordAccessControl: AccessControl
  updateSkilavottordRecyclingPartner: RecyclingPartner
}

export type MutationCreateRecyclingRequestAppSysArgs = {
  input: CreateRecyclingRequestInput
}

export type MutationCreateSkilavottordAccessControlArgs = {
  input: CreateAccessControlInput
}

export type MutationCreateSkilavottordGdprArgs = {
  gdprStatus: Scalars['String']
}

export type MutationCreateSkilavottordRecyclingPartnerArgs = {
  input: CreateRecyclingPartnerInput
}

export type MutationCreateSkilavottordRecyclingRequestArgs = {
  permno: Scalars['String']
  requestType: RecyclingRequestTypes
}

export type MutationCreateSkilavottordVehicleArgs = {
  permno: Scalars['String']
}

export type MutationCreateSkilavottordVehicleAppSysArgs = {
  permno: Scalars['String']
}

export type MutationCreateSkilavottordVehicleOwnerArgs = {
  name: Scalars['String']
}

export type MutationCreateSkilavottordVehicleOwnerAppSysArgs = {
  name: Scalars['String']
}

export type MutationDeleteSkilavottordAccessControlArgs = {
  input: DeleteAccessControlInput
}

export type MutationUpdateSkilavottordAccessControlArgs = {
  input: UpdateAccessControlInput
}

export type MutationUpdateSkilavottordRecyclingPartnerArgs = {
  input: UpdateRecyclingPartnerInput
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['String']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  skilavottordAccessControls: Array<AccessControl>
  skilavottordAccessControlsByRecyclingPartner: Array<AccessControl>
  skilavottordAllActiveRecyclingPartners: Array<RecyclingPartner>
  skilavottordAllDeregisteredVehicles: VehicleConnection
  skilavottordAllDeregisteredVehiclesAppSys: VehicleConnection
  skilavottordAllGdprs: Array<Gdpr>
  skilavottordAllRecyclingPartners: Array<RecyclingPartner>
  skilavottordAllRecyclingRequests: Array<RecyclingRequest>
  skilavottordDeRegisterVehicle: Scalars['Boolean']
  skilavottordFjarsyslaSkilagjald: Scalars['Boolean']
  skilavottordGdpr?: Maybe<Gdpr>
  skilavottordRecyclingPartner: RecyclingPartner
  skilavottordRecyclingPartnerVehicles: VehicleConnection
  skilavottordRecyclingPartnerVehiclesAppSys: VehicleConnection
  skilavottordRecyclingRequests: Array<RecyclingRequest>
  skilavottordUser?: Maybe<SkilavottordUser>
  skilavottordUserRecyclingRequest: Array<RecyclingRequest>
  skilavottordVehicleById: Vehicle
  skilavottordVehicleByIdAppSys: Vehicle
  skilavottordVehicleReadyToDeregistered: Vehicle
  skilavottordVehicles: Array<VehicleInformation>
}

export type QuerySkilavottordAllDeregisteredVehiclesArgs = {
  after: Scalars['String']
  first: Scalars['Int']
}

export type QuerySkilavottordAllDeregisteredVehiclesAppSysArgs = {
  after: Scalars['String']
  first: Scalars['Int']
}

export type QuerySkilavottordDeRegisterVehicleArgs = {
  recyclingPartner: Scalars['String']
  vehiclePermno: Scalars['String']
}

export type QuerySkilavottordFjarsyslaSkilagjaldArgs = {
  guid: Scalars['String']
  vehiclePermno: Scalars['String']
}

export type QuerySkilavottordRecyclingPartnerArgs = {
  input: RecyclingPartnerInput
}

export type QuerySkilavottordRecyclingPartnerVehiclesArgs = {
  after: Scalars['String']
  first: Scalars['Int']
}

export type QuerySkilavottordRecyclingPartnerVehiclesAppSysArgs = {
  after: Scalars['String']
  first: Scalars['Int']
}

export type QuerySkilavottordRecyclingRequestsArgs = {
  permno: Scalars['String']
}

export type QuerySkilavottordUserRecyclingRequestArgs = {
  permno: Scalars['String']
}

export type QuerySkilavottordVehicleByIdArgs = {
  permno: Scalars['String']
}

export type QuerySkilavottordVehicleByIdAppSysArgs = {
  permno: Scalars['String']
}

export type QuerySkilavottordVehicleReadyToDeregisteredArgs = {
  permno: Scalars['String']
}

export type RecyclingPartner = {
  __typename?: 'RecyclingPartner'
  active: Scalars['Boolean']
  address: Scalars['String']
  city: Scalars['String']
  companyId: Scalars['ID']
  companyName: Scalars['String']
  createdAt: Scalars['DateTime']
  email?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  phone: Scalars['String']
  postnumber: Scalars['String']
  recyclingRequests: Array<RecyclingRequest>
  updatedAt: Scalars['DateTime']
  website?: Maybe<Scalars['String']>
}

export type RecyclingPartnerInput = {
  companyId: Scalars['String']
}

export type RecyclingRequest = {
  __typename?: 'RecyclingRequest'
  createdAt?: Maybe<Scalars['DateTime']>
  id: Scalars['String']
  nameOfRequestor: Scalars['String']
  recyclingPartner: RecyclingPartner
  recyclingPartnerId: Scalars['String']
  requestType: RecyclingRequestTypes
  updatedAt?: Maybe<Scalars['DateTime']>
  vehicleId: Scalars['String']
}

export type RecyclingRequestResponse = RequestErrors | RequestStatus

export enum RecyclingRequestTypes {
  cancelled = 'cancelled',
  deregistered = 'deregistered',
  handOver = 'handOver',
  paymentFailed = 'paymentFailed',
  paymentInitiated = 'paymentInitiated',
  pendingRecycle = 'pendingRecycle',
}

export type RequestErrors = {
  __typename?: 'RequestErrors'
  message: Scalars['String']
  operation: Scalars['String']
}

export type RequestStatus = {
  __typename?: 'RequestStatus'
  status: Scalars['Boolean']
}

export enum Role {
  citizen = 'citizen',
  developer = 'developer',
  recyclingCompany = 'recyclingCompany',
  recyclingCompanyAdmin = 'recyclingCompanyAdmin',
  recyclingFund = 'recyclingFund',
}

export type SkilavottordUser = {
  __typename?: 'SkilavottordUser'
  name: Scalars['String']
  nationalId: Scalars['ID']
  partnerId?: Maybe<Scalars['String']>
  role: Role
}

export type UpdateAccessControlInput = {
  email: Scalars['String']
  name: Scalars['String']
  nationalId: Scalars['String']
  partnerId?: InputMaybe<Scalars['String']>
  phone: Scalars['String']
  recyclingLocation?: InputMaybe<Scalars['String']>
  role: AccessControlRole
}

export type UpdateRecyclingPartnerInput = {
  active: Scalars['Boolean']
  address: Scalars['String']
  city: Scalars['String']
  companyId: Scalars['String']
  companyName: Scalars['String']
  email: Scalars['String']
  nationalId: Scalars['String']
  phone: Scalars['String']
  postnumber: Scalars['String']
  website?: InputMaybe<Scalars['String']>
}

export type Vehicle = {
  __typename?: 'Vehicle'
  createdAt?: Maybe<Scalars['DateTime']>
  newregDate?: Maybe<Scalars['DateTime']>
  recyclingRequests?: Maybe<Array<RecyclingRequest>>
  updatedAt?: Maybe<Scalars['DateTime']>
  vehicleColor: Scalars['String']
  vehicleId: Scalars['String']
  vehicleType: Scalars['String']
  vinNumber: Scalars['String']
}

export type VehicleConnection = {
  __typename?: 'VehicleConnection'
  count: Scalars['Float']
  items: Array<Vehicle>
  pageInfo: PageInfo
}

export type VehicleInformation = {
  __typename?: 'VehicleInformation'
  color: Scalars['String']
  firstRegDate: Scalars['String']
  hasCoOwner: Scalars['Boolean']
  isRecyclable: Scalars['Boolean']
  permno: Scalars['String']
  status: Scalars['String']
  type: Scalars['String']
  vinNumber: Scalars['String']
}

export type CreateRequestMutationVariables = Exact<{
  input: CreateRecyclingRequestInput
}>

export type CreateRequestMutation = {
  __typename?: 'Mutation'
  createRecyclingRequestAppSys: {
    __typename?: 'RequestStatus'
    status: boolean
  }
}

export const CreateRequestDocument = gql`
  mutation createRequest($input: CreateRecyclingRequestInput!) {
    createRecyclingRequestAppSys(input: $input) {
      status
    }
  }
`

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    createRequest(
      variables: CreateRequestMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CreateRequestMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CreateRequestMutation>(
            CreateRequestDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'createRequest',
        'mutation',
      )
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
