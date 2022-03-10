import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'
import { Locale } from '@island.is/shared/types'

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
