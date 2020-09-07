import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

export type Locale = 'is' | 'en'

export interface Routes {
  auth: string
  home: string
  myBenefits: string
  termsOfUse: string
  error: string
  notFound: string
}

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: Locale
  localeKey: Locale
  routeKey?: keyof Routes
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
