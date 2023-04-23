import { ComponentType } from 'react'
import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import { GetServerSidePropsContext } from 'next'

export type ScreenContext = {
  query: GetServerSidePropsContext['query']
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
  asPath: string
  res: GetServerSidePropsContext['res']
  req: GetServerSidePropsContext['req']
  pathname: string
}

export type Screen<Props = {}> = ComponentType<Props> & {
  getProps?: (ctx: ScreenContext) => Promise<Props>
}
