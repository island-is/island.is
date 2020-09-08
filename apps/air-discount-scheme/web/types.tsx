import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

export type Locale = 'is' | 'en'

export interface Routes {
  admin: string
  auth: string
  error: string
  home: string
  myBenefits: string
  notFound: string
  personalInfoUsage: string
  termsOfUse: string
}

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: Locale
  localeKey: Locale
  routeKey?: keyof Routes
  route?: keyof Routes
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
