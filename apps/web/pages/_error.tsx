import React, { FC } from 'react'
import ErrorScreen from '../screens/Error/Error'
import { getLocaleFromPath } from '../i18n/withLocale'
import { Screen } from '../types'
import Layout, { LayoutProps } from '../layouts/main'
import I18n, { Locale } from '../i18n/I18n'

const LayoutPropsIS: LayoutProps = {
  footerUpperMenu: [
    {
      title: 'Um Stafrænt Ísland',
      href: 'https://stafraent.island.is/',
    },
    {
      title: 'Hafa samband',
      href: 'https://island.is/um-island-is/hafa-samband/',
    },
  ],
  footerLowerMenu: [
    {
      title: 'Mínar síður',
      href: 'https://minarsidur.island.is/',
    },
    {
      title: 'Heilsuvera',
      href: 'https://www.heilsuvera.is/',
    },
    {
      title: 'Opinber nýsköpun',
      href: 'https://opinbernyskopun.island.is/',
    },
    {
      title: 'Samráðsgátt',
      href: 'https://samradsgatt.island.is/',
    },
    {
      title: 'Mannanöfn',
      href: 'https://island.is/mannanofn/',
    },
    {
      title: 'Undirskriftarlistar',
      href: 'http://vefur.island.is/undirskriftalistar',
    },
    {
      title: 'Algengar spurningar',
      href: 'https://island.is/um-island-is/algengar-spurningar/',
    },
    {
      title: 'Opnir reikningar ríkisins',
      href: 'http://www.opnirreikningar.is/',
    },
    {
      title: 'Tekjusagan',
      href: 'https://tekjusagan.is/',
    },
  ],
  footerTagsMenu: [
    {
      title: 'Atvinnuleysisbætur',
      href: '#',
    },
    {
      title: 'Allir vinna',
      href: '#',
    },
    {
      title: 'COVID-19',
      href: '#',
    },
    {
      title: 'Ferðagjöf',
      href: '#',
    },
    {
      title: 'Fæðingarorlof',
      href: '#',
    },
    {
      title: 'Nafngjöf',
      href: '#',
    },
    {
      title: 'Sakavottorð',
      href: '#',
    },
  ],
  footerMiddleMenu: [
    {
      title: 'Fjölskyldumál og velferð',
      href: '#',
    },
    {
      title: 'Eldri borgarar',
      href: '#',
    },
    {
      title: 'Bætur',
      href: '#',
    },
    {
      title: 'Málefni fatlaðra',
      href: '#',
    },
    {
      title: 'Menntun',
      href: '#',
    },
    {
      title: 'Ferðalög og búseta erlendis',
      href: '#',
    },
    {
      title: 'Innflytjendur',
      href: '#',
    },
    {
      title: 'Umhverfismál',
      href: '#',
    },
    {
      title: 'Húsnæðismál',
      href: '#',
    },
  ],
  namespace: {
    login: 'Mínar síður',
    footerRightLabel: 'Flýtileiðir',
    footerMiddleLabel: 'Þjónustuflokkar',
    otherLanguageCode: 'en',
    otherLanguageName: 'EN',
    error404Title: 'Afsakið hlé :(',
    error404Body: 'Ekkert fannst á slóðinni {PATH}.',
    error500Title: 'Afsakið hlé :(',
    error500Body:
      'Eitthvað fór úrskeiðis.\nVillan hefur verið skráð og unnið verður að viðgerð eins fljótt og auðið er.',
    searchSuggestions: [
      'Covid -19',
      'Ökuskírteini',
      'Atvinnuleysisbætur',
      'Fæðingarorlof',
      'Rekstrarleyfi',
      'Heimilisfang',
    ],
  },
}

const LayoutPropsEN: LayoutProps = {
  footerUpperMenu: [
    {
      title: 'Um Stafrænt Ísland',
      href: 'https://stafraent.island.is/',
    },
    {
      title: 'Hafa samband',
      href: 'https://island.is/um-island-is/hafa-samband/',
    },
  ],
  footerLowerMenu: [
    {
      title: 'Mínar síður',
      href: 'https://minarsidur.island.is/',
    },
    {
      title: 'Heilsuvera',
      href: 'https://www.heilsuvera.is/',
    },
    {
      title: 'Opinber nýsköpun',
      href: 'https://opinbernyskopun.island.is/',
    },
    {
      title: 'Samráðsgátt',
      href: 'https://samradsgatt.island.is/',
    },
    {
      title: 'Mannanöfn',
      href: 'https://island.is/mannanofn/',
    },
    {
      title: 'Undirskriftarlistar',
      href: 'http://vefur.island.is/undirskriftalistar',
    },
    {
      title: 'Algengar spurningar',
      href: 'https://island.is/um-island-is/algengar-spurningar/',
    },
    {
      title: 'Opnir reikningar ríkisins',
      href: 'http://www.opnirreikningar.is/',
    },
    {
      title: 'Tekjusagan',
      href: 'https://tekjusagan.is/',
    },
  ],
  footerTagsMenu: [
    {
      title: 'Some tag',
      href: '#',
    },
  ],
  footerMiddleMenu: [
    {
      title: 'Linkt ot page',
      href: '#',
    },
  ],
  namespace: {
    login: 'Login',
    footerRightLabel: 'Shortcuts',
    footerMiddleLabel: 'Categories',
    otherLanguageCode: 'is',
    otherLanguageName: 'IS',
    error404Title: 'Sorry :(',
    error404Body: 'Nothing was found on {PATH}.',
    error500Title: 'Sorry :(',
    error500Body:
      'Something went wrong.\nThe error has been logged and we will fix this ASAP',
    searchSuggestions: [
      'Covid-19',
      'Hlutabætur',
      'Atvinnuleysisbætur',
      'Paternity leave',
      'Mannanafnanefnd',
      'Rekstrarleyfi',
      'Heimilisfang',
    ],
  },
}

type ErrorPageProps = {
  statusCode: number
  locale?: Locale
}

const ErrorPage: Screen<ErrorPageProps> = ({ statusCode, locale = 'is' }) => {
  const layoutProps = locale === 'is' ? LayoutPropsIS : LayoutPropsEN

  return (
    <I18n translations={layoutProps.namespace} locale={locale}>
      <Layout {...layoutProps}>
        <ErrorScreen statusCode={statusCode} />
      </Layout>
    </I18n>
  )
}

ErrorPage.getInitialProps = async ({ res, err, asPath }) => {
  return {
    statusCode: err?.statusCode ?? res?.statusCode ?? 404,
    locale: getLocaleFromPath(asPath),
  }
}

export default ErrorPage
