import React from 'react'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'

import { ReactComponent as NxLogo } from '../assets/nx-logo-white.svg'
import { withLocale } from '@island.is/localization'
import { useTranslations } from 'libs/localization/src/lib/LocaleContext'

import './index.scss'
const Home = (props) => {
  const { lang } = useTranslations()

  return (
    <div className="app">
      <header className="flex">
        <NxLogo alt="" width="75" height="50" />
        <h1>
          <FormattedMessage
            id="applications:title"
            description="This is a title in the application namespace" // Description should be a string literal
            defaultMessage="I'm a default title!" // Message should be a string literal
          />
          <FormattedMessage
            id="applications:description"
            description="This is a description in the application namespace" // Description should be a string literal
            defaultMessage="I'm a default description!" // Message should be a string literal
          />
        </h1>
      </header>
      <main>
        <Link href="/[lang]/about" as={`/${lang}/about`}>
          Client-Side Navigation: About same locale
        </Link>
        <Link href="/[lang]/about" as={`/en/about`}>
          Client-Side Navigation: About
        </Link>
      </main>
    </div>
  )
}

Home.getInitialProps = async (props) => {
  return {}
}

export default withLocale('applications')(Home)
