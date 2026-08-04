import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'

import { RuntimeEnv } from '@island.is/next/utils'

import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <RuntimeEnv env={buildPublicRuntimeEnv()} />
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
