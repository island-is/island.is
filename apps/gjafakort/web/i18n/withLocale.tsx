import React from 'react'
import { Locale } from './I18n'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'

export const withLocale = <
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
>(
  locale: Locale,
) => (Component: NextComponentType<C, IP, P>): NextComponentType<C, IP> => {
  const getInitialProps = Component.getInitialProps
  if (!getInitialProps) {
    return Component
  }

  const NewComponent: NextComponentType<C, IP, P> = (props) => (
    <Component {...props} />
  )

  NewComponent.getInitialProps = async (ctx) => {
    const newContext = Object.assign({}, ctx, { locale })
    const [props, { default: translations = {} }] = await Promise.all([
      getInitialProps(newContext),
      import(`./locales/${locale}.json`),
    ])
    return {
      ...props,
      locale,
      translations,
    }
  }
  return NewComponent
}

export default withLocale
