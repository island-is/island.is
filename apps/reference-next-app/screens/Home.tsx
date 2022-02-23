import React from 'react'
import {
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  defineMessage,
} from 'react-intl'
import { Header, Box, Divider, Page, Link } from '@island.is/island-ui/core'

import { withLocale, useLocale } from '@island.is/localization'

const welcomeMessage = defineMessage({
  id: 'reference:welcome',
  defaultMessage: 'Hæ, {name}!',
  description: 'Welcome message',
})

const Home = () => {
  const { lang, formatDate, formatTime, formatMessage } = useLocale()
  console.log('__intl formatMessage__', formatMessage)

  return (
    <div>
      <Page>
        <Box padding="containerGutter">
          <Header />
        </Box>
        <Box padding="containerGutter">
          <h2>Strings</h2>

          <FormattedMessage
            id="reference:title" // namespace:messageId
            description="This is a title in the reference namespace"
            defaultMessage="Island.is"
          />

          <p>
            {formatMessage({
              id: 'reference:description',
              description: 'This is a description in the reference namespace',
              defaultMessage: 'Lýsing',
            })}
          </p>
          <p>
            {formatMessage(welcomeMessage, {
              name: 'Foo',
            })}
          </p>
          <p>
            <FormattedMessage {...welcomeMessage} values={{ name: 'Bar' }} />
          </p>
        </Box>

        <Divider />
        <Box padding="containerGutter">
          <h2>Dates</h2>

          <span title={formatDate(new Date())}>
            <FormattedDate value={new Date()} />
          </span>
        </Box>
        <Divider />
        <Box padding="containerGutter">
          <h2>Time</h2>
          <span title={formatTime(new Date())}>
            <FormattedTime value={new Date()} />
          </span>
        </Box>
        <Box padding="containerGutter">
          <p>
            <Link href="/[lang]/about" as={`/${lang}/about`}>
              About page
            </Link>
          </p>
          <p>
            <Link href="/[lang]" as={`/${lang === 'en' ? 'is' : 'en'}`}>
              {lang === 'en' ? 'Icelandic' : 'English'}
            </Link>
          </p>
        </Box>
      </Page>
    </div>
  )
}

Home.getInitialProps = async () => {
  return {}
}

export default withLocale('reference')(Home)
