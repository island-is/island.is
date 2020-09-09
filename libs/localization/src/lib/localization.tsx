import React, { useEffect } from 'react'
import { TranslationsProvider } from './LocaleContext'
import dynamic from 'next/dynamic'

const appWithTranslation = (WrappedComponent) => {
  const AppWithTranslation = (props) => {
    console.log('AppWithTranslation', props)
    return (
      <>
        <TranslationsProvider
          locale={props.pageProps.locale}
          messages={props.pageProps.messages}
        >
          <WrappedComponent {...props} />
        </TranslationsProvider>
      </>
    )
  }
  AppWithTranslation.getInitialProps = WrappedComponent.getInitialProps

  return AppWithTranslation
}

export default appWithTranslation
