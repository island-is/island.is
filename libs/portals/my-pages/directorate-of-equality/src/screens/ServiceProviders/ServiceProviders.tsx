import { Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  ActionCardLoader,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  LinkButton,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { PageIntro } from '../../components/PageIntro/PageIntro'
import { getServiceProviderCardText } from '../../lib/cardText'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { useDirectorateOfEqualityServiceProvidersQuery } from './ServiceProviders.generated'

const ServiceProviders = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { data, loading, error } =
    useDirectorateOfEqualityServiceProvidersQuery()
  const providers = data?.directorateOfEqualityServiceProviders?.items ?? []

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(coreMessages.equalityServiceProviders)}
      introComponent={
        <PageIntro
          intro={formatMessage(messages.serviceProvidersPageIntro)}
          action={
            <LinkButton
              to={DirectorateOfEqualityPaths.GrantServiceProvider}
              text={formatMessage(messages.newServiceProvider)}
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
      {!loading && !error && providers.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noServiceProvidersTitle)}
          message={formatMessage(messages.noServiceProvidersMessage)}
          imgSrc="./assets/images/nodata.svg"
          titleSize="h2"
        />
      )}
      {!loading && !error && providers.length > 0 && (
        <>
          <Text
            as="h2"
            variant="eyebrow"
            color="foregroundBrandSecondary"
            marginBottom={2}
          >
            {formatMessage(coreMessages.equalityServiceProviders)}
          </Text>
          <Stack space={2}>
            {providers.map((provider) => (
              <ActionCard
                key={provider.id}
                heading={provider.name}
                {...getServiceProviderCardText(provider, formatMessage)}
                tag={{
                  label: formatMessage(messages.active),
                  variant: 'mint',
                  outlined: true,
                }}
                cta={{
                  label: formatMessage(coreMessages.seeDetails),
                  variant: 'text',
                  size: 'small',
                  icon: 'arrowForward',
                  ariaLabel: formatMessage(messages.viewAriaLabel, {
                    title: provider.name,
                  }),
                  url: DirectorateOfEqualityPaths.ServiceProviderDetail.replace(
                    ':id',
                    encodeURIComponent(provider.id),
                  ),
                }}
              />
            ))}
          </Stack>
        </>
      )}
    </IntroWrapper>
  )
}

export default ServiceProviders
