import { NextComponentType } from 'next'
import { NextPageContext } from 'next/dist/next-server/lib/utils'
import { Maybe, Namespace } from '@island.is/api/schema'

export type GetInitialPropsContext<Context> = Context & {
  locale: string
}

export type Screen<Props = {}> = NextComponentType<
  GetInitialPropsContext<NextPageContext>,
  Props,
  Props
>

/* GraphQL Types */
export type GetNamespaceQuery = { __typename?: 'Query' } & {
  getNamespace?: Maybe<{ __typename?: 'Namespace' } & Pick<Namespace, 'fields'>>
}
