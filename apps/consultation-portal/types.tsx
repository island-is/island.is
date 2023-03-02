import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import {
  NextComponentType,
  NextPageContext,
  GetServerSidePropsContext,
  GetServerSideProps,
} from 'next'

export type GetInitialPropsContext<Context> = Context & {
  apolloClient: ApolloClient<NormalizedCacheObject>
  props: any
}

export type Screen<Props = { data }> = NextComponentType<
  GetServerSideProps<GetServerSidePropsContext>,
  Props,
  Props
>
