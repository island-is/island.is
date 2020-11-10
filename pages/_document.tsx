import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'


interface Props {
  lang: string
}

class MyDocument extends Document<Props> {
  render() {
    return (
      <Html lang="en">
        <Head>
            <title>Þjónustusíður</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
