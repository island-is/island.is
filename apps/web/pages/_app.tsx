import '@island.is/api/mocks'
import type { AppProps } from 'next/app'
import { globalStyles } from '@island.is/island-ui/core'
import { ErrorBoundary } from '@island.is/web/components'

globalStyles()

export default function ({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
