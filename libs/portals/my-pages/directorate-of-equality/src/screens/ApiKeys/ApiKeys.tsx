import { useState } from 'react'

import {
  DirectorateOfEqualityApiKey,
  DirectorateOfEqualityApiKeyType,
} from '@island.is/api/schema'
import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  ActionCardLoader,
  InlineLink,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  LinkButton,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { PageIntro } from '../../components/PageIntro/PageIntro'
import { getApiKeyState } from '../../lib/apiKeys'
import { getApiKeyCardText } from '../../lib/cardText'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { getApiKeyTag } from '../../lib/status'
import { useDirectorateOfEqualityApiKeysQuery } from './ApiKeys.generated'

const ApiKeys = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const [showInactive, setShowInactive] = useState(false)
  const { data, loading, error } = useDirectorateOfEqualityApiKeysQuery()
  const items = data?.directorateOfEqualityApiKeys?.items ?? []
  const now = new Date()
  const active = items.filter(
    (apiKey) => getApiKeyState(apiKey, now) === 'active',
  )
  const inactive = items.filter(
    (apiKey) => getApiKeyState(apiKey, now) !== 'active',
  )

  const renderCard = (apiKey: DirectorateOfEqualityApiKey) => {
    const title = apiKey.label ?? formatMessage(messages.keyFallbackTitle)

    return (
      <ActionCard
        key={apiKey.id}
        heading={title}
        {...getApiKeyCardText(apiKey, formatMessage)}
        tag={{
          ...getApiKeyTag(getApiKeyState(apiKey, now), formatMessage),
          outlined: true,
        }}
        secondaryTag={
          apiKey.type === DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER
            ? {
                label: formatMessage(messages.keyTypeServiceProviderTag),
                variant: 'purple',
                outlined: true,
              }
            : undefined
        }
        cta={{
          label: formatMessage(coreMessages.seeDetails),
          variant: 'text',
          size: 'small',
          icon: 'arrowForward',
          ariaLabel: formatMessage(messages.viewAriaLabel, { title }),
          url: DirectorateOfEqualityPaths.ApiKeyDetail.replace(
            ':id',
            encodeURIComponent(apiKey.id),
          ),
        }}
      />
    )
  }

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(coreMessages.equalityApiKeys)}
      introComponent={
        <PageIntro
          intro={
            <>
              {formatMessage(messages.apiKeysPageIntro)}{' '}
              <InlineLink to={DirectorateOfEqualityPaths.ServiceProviders}>
                {formatMessage(messages.apiKeysPageIntroLink)}
              </InlineLink>
              .
            </>
          }
          action={
            <LinkButton
              to={DirectorateOfEqualityPaths.CreateApiKey}
              text={formatMessage(messages.newApiKey)}
              icon="add"
              size="small"
            />
          }
        />
      }
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      {loading && <ActionCardLoader repeat={2} />}
      {!loading && error && <Problem error={error} noBorder={false} />}
      {!loading && !error && active.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(
            inactive.length > 0
              ? messages.noActiveKeysTitle
              : messages.noCompanyKeysTitle,
          )}
          message={formatMessage(
            inactive.length > 0
              ? messages.noActiveKeysMessage
              : messages.noCompanyKeysMessage,
          )}
          imgSrc="./assets/images/nodata.svg"
          titleSize="h2"
        />
      )}
      {!loading && !error && active.length > 0 && (
        <>
          <Text
            as="h2"
            variant="eyebrow"
            color="foregroundBrandSecondary"
            marginBottom={2}
          >
            {formatMessage(coreMessages.equalityApiKeys)}
          </Text>
          <Stack space={2}>{active.map(renderCard)}</Stack>
        </>
      )}
      {inactive.length > 0 && (
        <Box marginTop={3}>
          <Button
            variant="text"
            size="small"
            icon={showInactive ? 'chevronUp' : 'chevronDown'}
            aria-expanded={showInactive}
            aria-controls={showInactive ? 'doe-inactive-keys' : undefined}
            onClick={() => setShowInactive((value) => !value)}
          >
            {formatMessage(
              showInactive
                ? messages.hideInactiveKeys
                : messages.showInactiveKeys,
              { count: inactive.length },
            )}
          </Button>
        </Box>
      )}
      {inactive.length > 0 && showInactive && (
        <Box id="doe-inactive-keys" marginTop={3}>
          <Stack space={2}>{inactive.map(renderCard)}</Stack>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default ApiKeys
