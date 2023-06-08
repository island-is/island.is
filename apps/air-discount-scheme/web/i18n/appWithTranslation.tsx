import React, { createContext } from 'react'

import {
  Translation,
  icelandicTranslations,
  englishTranslations,
} from './locales'
import I18n from './I18n'

interface TranslationsContextType {
  is: Translation
  en: Translation
  default: Translation
}

export const TranslationsContext =
  createContext<TranslationsContextType | null>({
    is: icelandicTranslations as Translation,
    en: englishTranslations as Translation,
    default: {
      notFound: {
        title: '',
        content: '',
        button: '',
      },
      error: {
        title: '',
        intro: '',
        introKennitalaIsNotAPerson: '',
        button: '',
      },
      errorBoundary: {
        title: '',
        contents: [],
      },
    } as Translation,
  })

const appWithTranslation = (WrappedComponent) => {
  const AppWithTranslation = (props) => {
    return (
      <I18n localeKey={props.pageProps?.localeKey}>
        <WrappedComponent {...props} />
      </I18n>
    )
  }
  AppWithTranslation.getInitialProps = WrappedComponent.getInitialProps

  return AppWithTranslation
}

export default appWithTranslation
