import { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'
import { CustomPageUniqueIdentifier as GraphQLCustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { ZendeskEmbeddedChat } from './components/ZendeskEmbeddedChat'
import { m } from './translations.strings'
import * as styles from './AskTheBudgetBill.css'

/**
 * Overridable via the 'zendeskSnippetUrl' key in the custom page's configJson.
 * The key is a public client side widget identifier, not a secret.
 */
const DEFAULT_ZENDESK_SNIPPET_URL =
  'https://static.zdassets.com/ekr/snippet.js?key=981362b3-9805-4375-b7cf-eafa3ac78ff5'

interface AskTheBudgetBillProps {
  languageToggleHrefOverride: {
    is: string
    en: string
  }
}

const AskTheBudgetBill: CustomScreen<AskTheBudgetBillProps> = ({
  customPageData,
}) => {
  const { formatMessage } = useIntl()
  const [hasChatError, setHasChatError] = useState(false)

  useContentfulId(customPageData?.id)

  const snippetUrl =
    (customPageData?.configJson?.zendeskSnippetUrl as string | undefined) ||
    DEFAULT_ZENDESK_SNIPPET_URL

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '10/12']}
          paddingBottom={[4, 4, 6]}
        >
          <Stack space={4}>
            <Text variant="h1" as="h1">
              {formatMessage(m.heading)}
            </Text>

            {hasChatError ? (
              <AlertMessage
                type="warning"
                title={formatMessage(m.chatErrorTitle)}
                message={formatMessage(m.chatErrorMessage)}
              />
            ) : (
              <Stack space={1}>
                <ZendeskEmbeddedChat
                  snippetUrl={snippetUrl}
                  className={styles.chatContainer}
                  onError={() => setHasChatError(true)}
                />
                <Text variant="small" color="dark400" textAlign="center">
                  {formatMessage(m.disclaimer)}
                </Text>
              </Stack>
            )}
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

AskTheBudgetBill.getProps = async ({ customPageData }) => {
  return {
    languageToggleHrefOverride: {
      is: '/spurdu-fjarlagafrumvarpid',
      en: customPageData?.configJson?.englishFallbackUrl ?? '',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.AskTheBudgetBill as GraphQLCustomPageUniqueIdentifier,
    AskTheBudgetBill,
  ),
)
