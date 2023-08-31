import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import React from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

function displayFeatureUpvote() {
  function resizeIframe() {
    const iframe = document.getElementById('my-iframe')
    if (iframe) {
      iframe.style.height =
        (iframe as any).contentWindow.document.body.scrollHeight + 'px'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <iframe
        id="my-iframe"
        scrolling="no"
        src="https://islandis.featureupvote.com/"
        style={{
          marginTop: '0px',
          width: '100%',
          height: 'calc(100% - 0px)',
          border: 'none',
          overflowY: 'scroll',
        }}
        onLoad={() => resizeIframe()}
      ></iframe>
    </div>
  )
}

const Screen = withApollo(
  withLocale('is')(
    withMainLayout(displayFeatureUpvote, {
      showHeader: true,
      showFooter: false,
    }),
  ),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
