import '@island.is/api/mocks'
import { globalStyles } from '@island.is/island-ui/core'
import Head from 'next/head'
import { PLAUSIBLE_SCRIPT_SRC } from '../constants'

globalStyles()

export default ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <script
          defer
          data-domain={process.env.TRACKING_DOMAIN || 'island.is'}
          src={PLAUSIBLE_SCRIPT_SRC}
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
