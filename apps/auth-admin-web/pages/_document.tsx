import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

interface Props {
  lang: string
}

class MyDocument extends Document<Props> {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <div className="document__wrapper">
            <Main />
            <NextScript />
          </div>
          <footer>
            Identity Server Admin - <a href="#todo">Help pages</a>
          </footer>
        </body>
      </Html>
    )
  }
}

export default MyDocument
