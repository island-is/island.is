import React from 'react'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

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

const Screen = withApollo(
  withLocale('is')(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    withMainLayout(displayFeatureUpvote, {
      showHeader: true,
      showFooter: false,
    }),
  ),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
