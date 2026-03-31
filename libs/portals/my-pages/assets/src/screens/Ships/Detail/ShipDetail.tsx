import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ShipRegistryLocale } from '@island.is/api/schema'
import {
  EmptyState,
  InfoLine,
  InfoLineStack,
  IntroWrapperV2,
  SAMGONGUSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Box, Stack, Tag, Tabs } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { shipsMessages } from '../../../lib/messages'
import { useShipDetailQuery } from './ShipDetail.generated'
import { CertificatesTable } from './components/CertificatesTable'
import { RegistrationTab } from './components/RegistrationTab'

export const ShipDetail = () => {
  useNamespaces('sp.ships')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams()

  const { data, loading, error } = useShipDetailQuery({
    variables: {
      input: {
        registrationNumber: id ?? '',
        locale: lang === 'en' ? ShipRegistryLocale.En : ShipRegistryLocale.Is,
      },
    },
  })

  const ship = data?.shipRegistryUserShip
  const certificates = useMemo(() => ship?.certificates ?? [], [ship])

  return (
    <IntroWrapperV2
      title={ship?.name ?? formatMessage(shipsMessages.title)}
      intro={formatMessage(shipsMessages.intro)}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.shipsTooltip),
      }}
    >
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !ship && (
        <EmptyState description={shipsMessages.notFound} />
      )}

      {(ship || loading) && (
        <Stack space={3}>
          <Box>
            <InfoLineStack>
              <InfoLine
                loading={loading}
                label={formatMessage(shipsMessages.seaworthinessTitle)}
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
                content={ship?.registrationNumber?.toString() ?? '-'}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.region?.label ?? formatMessage(shipsMessages.region)
                }
                content={ship?.region?.value ?? undefined}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.usageType?.label ??
                  formatMessage(shipsMessages.shipType)
                }
                content={ship?.usageType?.value ?? undefined}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.imoNumber?.label ??
                  formatMessage(shipsMessages.imoNumber)
                }
                content={ship?.imoNumber?.value ?? undefined}
              />
              <InfoLine
                loading={loading}
                label={
                  ship?.phoneOnBoard?.label ??
                  formatMessage(shipsMessages.phoneOnBoard)
                }
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
    </IntroWrapperV2>
  )
}

export default ShipDetail
