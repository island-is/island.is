import React from 'react'
import { Flex, Note, Paragraph, TextLink } from '@contentful/f36-components'

const LocalhostWarning = () => {
  return (
    <Flex marginTop="spacingXl" justifyContent="center">
      <Note
        title="App running outside of Contentful"
        style={{ maxWidth: '800px' }}
      >
        <Paragraph>
          Contentful Apps need to run inside the Contentful web app to function
          properly. Install the app into a space and render your app into one of
          the{' '}
          <TextLink href="https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#locations">
            available locations
          </TextLink>
          .
        </Paragraph>
        <br />

        <Paragraph>
          Follow{' '}
          <TextLink href="https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/#embed-your-app-in-the-contentful-web-app">
            our guide
          </TextLink>{' '}
          to get started or{' '}
          <TextLink href="https://app.contentful.com/deeplink?link=apps">
            open Contentful
          </TextLink>{' '}
          to manage your app.
        </Paragraph>
      </Note>
    </Flex>
  )
}

export default LocalhostWarning
