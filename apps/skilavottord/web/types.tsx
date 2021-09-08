import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { NextComponentType, NextPageContext } from 'next'

export interface Car {
  permno: string
  vinNumber: string
  type: string
  color: string
  firstRegDate: string
  isRecyclable: boolean
  hasCoOwner: boolean
  status: string
}

export interface RecyclingPartner {
  companyId: string
  companyName: string
  address: string
  postnumber: string
  city: string
  website: string
  phone: string
  active: boolean
}

export interface VehicleOwner {
  nationalId: string
  personname: string
  vehicles: Vehicle[]
}

export interface Vehicle {
  vehicleId: string
  vehicleType: string
  vehicleColor: string
  newregDate: string
  recyclingRequests: RecyclingRequest[]
}

export interface RecyclingRequest {
  id: string
  vehicleId: string
  recyclingPartnerId: string
  requestType: RecyclingRequestTypes
  nameOfRequestor: string
  createdAt: string
  updatedAt: string
}

export interface RecyclingRequestMutation {
  createSkilavottordRecyclingRequest: RecyclingRequestMutationData
}

export interface RecyclingRequestMutationData {
  permno: string
  partnerId: string
  requestType: RecyclingRequestTypes
  status: string
  message: string
}

export type RecycleActionTypes = 'confirm' | 'handover' | 'completed'

export type RecyclingRequestTypes =
  | 'pendingRecycle'
  | 'handOver'
  | 'deregistered'
  | 'cancelled'
  | 'paymentInitiated'
  | 'paymentFailed'

export type ProcessType = 'citizen' | 'company'

export interface User {
  name: string
  nationalId: string
  partnerId: string
  mobile: string
  role: string
}

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>

export type WithApolloProps = NextComponentType<
  GetInitialPropsContext<NextPageContext>
> & {
  apolloState: any
}
