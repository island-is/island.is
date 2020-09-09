import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ReactComponent as NxLogo } from '../assets/nx-logo-white.svg'
import { withLocale } from '@island.is/localization'

import './index.scss'

const About = (props) => {
  console.log('home props', props)

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./${fileName}.${style} file.
   */
  return (
    <div className="app">
      <header className="flex">
        <NxLogo alt="" width="75" height="50" />
        <h1>
          <FormattedMessage
            id="global:title"
            description="This is a title in the application namespace" // Description should be a string literal
            defaultMessage="I'm a default global title!" // Message should be a string literal
          />
          <FormattedMessage
            id="global:description"
            description="This is a description in the application namespace" // Description should be a string literal
            defaultMessage="I'm a default global description!" // Message should be a string literal
          />
        </h1>
      </header>
    </div>
  )
}

About.getInitialProps = async (props) => {
  return {}
}

export default withLocale('global')(About)
