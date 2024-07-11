import { ComponentType } from 'react'
import { GetServerSidePropsContext } from 'next'
import { NormalizedCacheObject } from '@apollo/client/cache'
import { ApolloClient } from '@apollo/client/core'

export type ScreenContext = {
  query: GetServerSidePropsContext['query']
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
  res: GetServerSidePropsContext['res']
  req: GetServerSidePropsContext['req']
}

export type Screen<Props = {}> = ComponentType<Props> & {
  getProps?: (ctx: ScreenContext) => Promise<Props>
}
