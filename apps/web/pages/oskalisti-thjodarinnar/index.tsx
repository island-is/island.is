import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import React from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'

function displayFeatureUpvote() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <iframe
        src="https://islandis.featureupvote.com/"
        style={{
          marginTop: '0px',
          width: '100%',
          height: 'calc(100% - 0px)',
          border: 'none',
          overflowY: 'scroll',
        }}
      />
    </div>
  )
}

export default withApollo(
  withLocale('is')(
    withMainLayout(displayFeatureUpvote, {
      showHeader: true,
      showFooter: false,
    }),
  ),
)
