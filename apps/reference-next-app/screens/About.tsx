import React from 'react'
import { FormattedMessage } from 'react-intl'

import { withLocale } from '@island.is/localization'
import { Page, Box, Header } from '@island.is/island-ui/core'

const About = () => (
  <div>
    <Page>
      <Box padding="containerGutter">
        <Header />
      </Box>
      <Box padding="containerGutter">
        <h2>Strings</h2>
        <p>
          <FormattedMessage
            id="referance.nextjs:title"
            description="This is a title in the referance.nextjs namespace"
            defaultMessage="Default titill"
          />
        </p>
        <p>
          <FormattedMessage
            id="referance.nextjs:description"
            description="This is a description in the referance.nextjs namespace"
            defaultMessage="Default lýsing"
          />
        </p>
      </Box>
    </Page>
  </div>
)

About.getInitialProps = async () => {
  return {}
}

export default withLocale('referance.nextjs')(About)
