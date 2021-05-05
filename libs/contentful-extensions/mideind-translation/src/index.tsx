import * as React from 'react'
import { render } from 'react-dom'
import { Button } from '@contentful/forma-36-react-components'
import { init, SidebarExtensionSDK } from 'contentful-ui-extensions-sdk'
import tokens from '@contentful/forma-36-tokens'
import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'
import Sidebar from './components/Sidebar'

init((sdk) => {
  render(
    <Sidebar sdk={sdk as SidebarExtensionSDK} />,
    document.getElementById('root'),
  )
})

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
