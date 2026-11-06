import Document, { Head, Html, Main, NextScript } from 'next/document'

import { buildPublicRuntimeEnv } from '@island.is/judicial-system-web/environments/runtimeEnvironment'
import { RuntimeEnv } from '@island.is/next/utils'

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
