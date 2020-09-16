import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

export interface MockCar {
  permno: string
  type: string
  newregdate: string
  color: string
  recyclable: boolean
  status?: string
  isCoOwned?: boolean
}

export interface MockUser {
  name: string
  nationalId: string
  mobile: number
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
