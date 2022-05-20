import React from 'react'
import I18n, { isLocale } from './I18n'
import { NextPage, NextPageContext, NextComponentType } from 'next'
import { ApolloClient } from '@apollo/client/core'
import { NormalizedCacheObject } from '@apollo/client/cache'
import { GET_NAMESPACE_QUERY } from '../screens/queries'
import { GetNamespaceQuery, QueryGetNamespaceArgs } from '../graphql/schema'
import { Locale } from '@island.is/shared/types'
import { defaultLanguage } from '@island.is/shared/constants'

export const getLocaleFromPath = (path = ''): Locale => {
  const maybeLocale = path.split('/').find(Boolean)
  return isLocale(maybeLocale) ? maybeLocale : defaultLanguage
}

interface NewComponentProps<T> {
  pageProps: T
  locale: Locale
  translations: { [k: string]: string }
}

type NextContext = {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: Locale
} & NextPageContext

export const withLocale = <Props,>(locale?: Locale) => (
  Component: NextPage<Props>,
): NextComponentType => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  const NewComponent: NextPage<NewComponentProps<Props>> = ({
    pageProps,
    locale,
    translations,
  }) => (
    <I18n locale={locale} translations={translations}>
      <Component {...pageProps} />
    </I18n>
  )

  NewComponent.getInitialProps = async (
    ctx: Exclude<NextContext, 'locale'>,
  ) => {
    const newContext: NextContext = {
      ...ctx,
      locale: locale || getLocaleFromPath(ctx.asPath),
    }
    const [props, translations] = await Promise.all([
      getInitialProps(newContext),
      getGlobalStrings(newContext),
    ])
    return {
      pageProps: props,
      locale,
      translations,
    }
  }

  return NewComponent
}

const getGlobalStrings = async ({
  apolloClient,
  locale,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>
  locale: Locale
}) => {
  return apolloClient
    .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Global',
          lang: locale,
        },
      },
    })
    .then((content) => {
      // map data here to reduce data processing in component
      return JSON.parse(content.data.getNamespace.fields)
    })
}

export default withLocale
