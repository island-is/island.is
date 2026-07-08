import Document, { Head, Html, Main, NextScript } from 'next/document'

import {
  NEXT_RUNTIME_ENV_SCRIPT_ID,
  serializeRuntimeEnv,
} from '@island.is/shared/utils'

import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="is">
        <Head>
          <script
            id={NEXT_RUNTIME_ENV_SCRIPT_ID}
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: serializeRuntimeEnv(buildPublicRuntimeEnv()),
            }}
          />
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
