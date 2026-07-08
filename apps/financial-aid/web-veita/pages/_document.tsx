import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import {
  NEXT_RUNTIME_ENV_SCRIPT_ID,
  serializeRuntimeEnv,
} from '@island.is/shared/utils'
import { buildPublicRuntimeEnv } from '../environments/runtimeEnvironment'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
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
          <Main />
          {/* Here we will mount our modal portal */}
          <NextScript />
        </body>
      </Html>
    )
  }
}
