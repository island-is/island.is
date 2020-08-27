import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'

import { Routes } from './i18n'

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: string
  routeKey?: keyof Routes
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>
