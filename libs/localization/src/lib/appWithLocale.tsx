import React from 'react'
import { LocaleProvider } from './LocaleContext'

const appWithLocale = (WrappedComponent) => {
  const AppWithLocale = (props) => {
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
