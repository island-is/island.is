import Document, { Head, Html, Main, NextScript } from 'next/document'

import { RuntimeEnv } from '@island.is/next/utils'

import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="is">
        <Head>
          <RuntimeEnv env={buildPublicRuntimeEnv()} />
        </Head>
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
