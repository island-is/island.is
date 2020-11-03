import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

export interface Car {
  permno: string
  type: string
  color: string
  firstRegDate: string
  isRecyclable: boolean
  hasCoOwner: boolean
  status: string
}

export interface MockRecyclingPartner {
  id: number
  name: string
  address: string
  postNumber: number
  city?: string
  website?: string
  phone?: string
  active?: boolean
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

export type RecycleActionTypes = 'confirm' | 'handover' | 'completed'

export interface User {
  name: string
  nationalId: string
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
