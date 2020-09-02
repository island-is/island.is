import React from 'react'

import I18n from './I18n'

const appWithTranslation = (WrappedComponent) => {
  const AppWithTranslation = (props) => {
    return (
      <I18n locale={props.pageProps?.locale || 'is'}>
        <WrappedComponent {...props} />
      </I18n>
    )
  }
  AppWithTranslation.getInitialProps = WrappedComponent.getInitialProps

  return AppWithTranslation
}

export default appWithTranslation
