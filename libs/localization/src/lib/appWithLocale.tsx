import React from 'react'
import { Locale, LocaleProvider, MessagesDict } from './LocaleContext'
import { NextComponentType } from 'next'
import { BaseContext, NextPageContext } from 'next/dist/next-server/lib/utils'

interface Props {
  pageProps: { locale: Locale; messages: MessagesDict }
}
export const appWithLocale = <C extends BaseContext = NextPageContext, IP = {}>(
  WrappedComponent: NextComponentType<C, Props, Props>,
) => {
  const AppWithLocale = (props: Props) => {
    return (
      <LocaleProvider
        locale={props.pageProps.locale}
        messages={props.pageProps.messages}
      >
        <WrappedComponent {...props} />
      </LocaleProvider>
    )
  }
  AppWithLocale.getInitialProps = WrappedComponent.getInitialProps

  return AppWithLocale
}

export default appWithLocale
