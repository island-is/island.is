import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import React from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'

const title = 'Óskalisti þjóðarinnar'

function Stuff() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <iframe
        src="https://islandis.featureupvote.com/"
        style={{
          marginTop: '0px', // adjust this value to match the height of your header
          width: '100%',
          height: 'calc(100% - 0px)', // adjust this value to match the height of your header
          border: 'none',
          overflowY: 'scroll',
          textAlign: 'center',
        }}
      />
    </div>
  )
}

export default withApollo(
  withLocale('is')(
    withMainLayout(Stuff, {
      showHeader: true,
      showFooter: false,
    }),
  ),
)
