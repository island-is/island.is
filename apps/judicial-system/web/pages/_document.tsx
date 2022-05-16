import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { SkipToContent } from '../src/components'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="is">
        <SkipToContent />
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <body>
          <div id="main">
            <Main />
          </div>
          {/* Here we will mount our modal portal */}
          <div id="modal" />
          <NextScript />
        </body>
      </Html>
    )
  }
}
