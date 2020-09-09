import React, { useEffect } from 'react'
import { LocaleProvider } from './LocaleContext'

const appWithTranslation = (WrappedComponent) => {
  const AppWithTranslation = (props) => {
    return (
      <>
        <LocaleProvider
          locale={props.pageProps.locale}
          messages={props.pageProps.messages}
        >
          <WrappedComponent {...props} />
        </LocaleProvider>
      </>
    )
  }
  AppWithTranslation.getInitialProps = WrappedComponent.getInitialProps

  return AppWithTranslation
}

export default appWithTranslation
