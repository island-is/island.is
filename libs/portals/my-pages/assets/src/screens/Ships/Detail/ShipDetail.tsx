import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  SAMGONGUSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Box, Stack, Tag, Tabs, Text } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { shipsMessages } from '../../../lib/messages'
import { useShipDetailQuery } from './ShipDetail.generated'
import { CertificatesTable } from './components/CertificatesTable'
import { RegistrationTab } from './components/RegistrationTab'
import { LocaleEnum } from '@island.is/portals/my-pages/graphql'

export const ShipDetail = () => {
  useNamespaces('sp.ships')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams()

  const { data, loading, error } = useShipDetailQuery({
    variables: {
      input: {
        registrationNumber: id ?? '',
        locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is,
      },
    },
  })

  const ship = data?.shipRegistryUserShip
  const certificates = useMemo(() => ship?.certificates ?? [], [ship])

  return (
    <IntroWrapper
      title={ship?.name ?? formatMessage(shipsMessages.title)}
      introComponent={
        <Stack space={2}>
          <Text>{formatMessage(shipsMessages.intro)}</Text>
          <Text>{formatMessage(shipsMessages.shipDetailIntroWarning)}</Text>
        </Stack>
      }
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.shipsTooltip),
      }}
    >
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !ship && (
        <Problem type="no_data" noBorder={false} />
      )}

      {(ship || loading) && (
        <Stack space={2}>
          <Box marginBottom={3}>
            <InfoLineStack space={1} marginBottom={0}>
              <InfoLine
                loading={loading}
                label={formatMessage(shipsMessages.seaworthinessTitle)}
                labelColumnSpan={'5/12'}
                content={
                  <Tag outlined variant={ship?.isSeaworthy ? 'mint' : 'red'}>
                    {!ship?.isSeaworthy
                      ? formatMessage(shipsMessages.invalidTag)
                      : ship?.seaworthinessCertificateValidTo?.value
                      ? formatMessage(shipsMessages.seaworthinessValidTo, {
                          date: ship?.seaworthinessCertificateValidTo?.value,
                        })
                      : formatMessage(coreMessages.valid)}
                  </Tag>
                }
              />
              <InfoLine
                loading={loading}
                label={formatMessage(shipsMessages.registrationNumber)}
                labelColumnSpan={'5/12'}
                content={ship?.registrationNumber?.toString() ?? '-'}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.region?.label ?? formatMessage(shipsMessages.region)
                }
                labelColumnSpan={'5/12'}
                content={ship?.region?.value ?? undefined}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.usageType?.label ??
                  formatMessage(shipsMessages.shipType)
                }
                labelColumnSpan={'5/12'}
                content={ship?.usageType?.value ?? undefined}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.imoNumber?.label ??
                  formatMessage(shipsMessages.imoNumber)
                }
                labelColumnSpan={'5/12'}
                content={ship?.imoNumber?.value ?? undefined}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.phoneOnBoard?.label ??
                  formatMessage(shipsMessages.phoneOnBoard)
                }
                labelColumnSpan={'5/12'}
                content={ship?.phoneOnBoard?.value ?? undefined}
              />
            </InfoLineStack>
          </Box>

          {(ship || loading) && (
            <Tabs
              label={`${formatMessage(
                shipsMessages.registrationTab,
              )} / ${formatMessage(shipsMessages.certificatesTab)}`}
              contentBackground="white"
              tabs={[
                {
                  label: formatMessage(shipsMessages.registrationTab),
                  content: <RegistrationTab ship={ship} loading={loading} />,
                },
                {
                  label: formatMessage(shipsMessages.certificatesTab),
                  content: (
                    <CertificatesTable
                      certificates={certificates}
                      loading={loading}
                    />
                  ),
                },
              ]}
            />
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default ShipDetail
