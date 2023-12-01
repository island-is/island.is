import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="is">
        <Head></Head>
        <body>
          <div id="main">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    )
  }
}
