import React from 'react'
import I18n from './I18n'
import { NextComponentType } from 'next'

const appWithTranslation = (WrappedComponent: NextComponentType) => {
  const AppWithTranslation = (props: any) => {
    return (
      <I18n
        translations={props.pageProps?.translations || {}}
        locale={props.pageProps?.locale || 'is'}
      >
        <WrappedComponent {...props} />
      </I18n>
    )
  }
  AppWithTranslation.getInitialProps = WrappedComponent.getInitialProps

  return AppWithTranslation
}

export default appWithTranslation
