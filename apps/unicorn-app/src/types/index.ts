import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextComponentType, NextPageContext } from 'next'
import { Locale, Environment } from '@island.is/shared/types'

console.log(Environment.Development)
export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: Locale
  localeKey: Locale
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
