import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { RuntimeEnv } from '@island.is/next/utils'
import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <RuntimeEnv env={buildPublicRuntimeEnv()} />
        </Head>
        <body>
          <Main />
          {/* Here we will mount our modal portal */}
          <NextScript />
        </body>
      </Html>
    )
  }
}
