import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import { NextComponentType, NextPageContext } from 'next'

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
