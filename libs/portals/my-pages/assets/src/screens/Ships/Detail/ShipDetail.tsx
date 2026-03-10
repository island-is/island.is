import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ShipRegistryLocale } from '@island.is/api/schema'
import {
  EmptyState,
  IntroWrapperV2,
  InfoLine,
  InfoLineStack,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Box, Stack, Tag, Tabs } from '@island.is/island-ui/core'
import { shipsMessages } from '../../../lib/messages'
import { useShipDetailQuery } from './ShipDetail.generated'

export const ShipDetail = () => {
  useNamespaces('sp.ships')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams()

  const { data, loading, error } = useShipDetailQuery({
    variables: {
      input: {
        id: id ?? '',
        locale: lang === 'en' ? ShipRegistryLocale.En : ShipRegistryLocale.Is,
      },
    },
  })

  const ship = data?.shipRegistryUserShip

  const registrationTabContent = (
    <Stack space={3}>
      {ship?.fishery && (
        <InfoLineStack label={formatMessage(shipsMessages.operatorTitle)}>
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.operatorName)}
            content={ship.fishery.name ?? undefined}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.operatorAddress)}
            content={ship.fishery.address ?? undefined}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.operatorLocation)}
            content={ship.fishery.postalCode ?? undefined}
          />
        </InfoLineStack>
      )}

      <InfoLineStack label={formatMessage(shipsMessages.constructionTitle)}>
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.constructionYard)}
          content={ship?.constructionStation ?? undefined}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.constructionYear)}
          content={ship?.constructionYear?.toString()}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.hullMaterial)}
          content={ship?.hullMaterial ?? undefined}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.classification)}
          content={ship?.classificationSociety ?? undefined}
        />
      </InfoLineStack>

      {ship?.measurements && (
        <InfoLineStack label={formatMessage(shipsMessages.measurementsTitle)}>
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.registeredLength)}
            content={ship.measurements.length?.toString()}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.maxLength)}
            content={ship.measurements.mostLength?.toString()}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.width)}
            content={ship.measurements.width?.toString()}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.grossTonnage)}
            content={ship.measurements.bruttoGrt?.toString()}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.netTonnage)}
            content={ship.measurements.nettoWeightTons?.toString()}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.depth)}
            content={ship.measurements.depth?.toString()}
          />
        </InfoLineStack>
      )}

      {ship?.engines?.map((engine, i) => (
        <InfoLineStack
          key={i}
          label={`${formatMessage(shipsMessages.enginesTitle)}${
            engine.manufacturer ? ` / ${engine.manufacturer}` : ''
          }`}
        >
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.enginePower)}
            content={engine.power != null ? `${engine.power} kW` : undefined}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.engineYear)}
            content={engine.year?.toString()}
          />
        </InfoLineStack>
      ))}
    </Stack>
  )

  return (
    <IntroWrapperV2
      title={ship?.name ?? formatMessage(shipsMessages.title)}
      intro={formatMessage(shipsMessages.intro)}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(shipsMessages.tooltip),
      }}
    >
      {error && <p>Error loading ship</p>}

      <Stack space={3}>
        <Box background="blue100" padding={[2, 3, 4]} borderRadius="large">
          <InfoLineStack>
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.seafaringCertificate)}
              content={
                ship?.seaworthiness ? (
                  <Tag
                    outlined
                    variant={ship.seaworthiness.isValid ? 'mint' : 'red'}
                    disabled
                  >
                    {ship.seaworthiness.isValid
                      ? formatMessage(shipsMessages.validTag)
                      : formatMessage(shipsMessages.expiredTag)}
                  </Tag>
                ) : undefined
              }
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.registrationNumber)}
              content={ship?.registrationNumber?.toString()}
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.districtLetters)}
              content={ship?.identification?.regionAcronym}
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.shipType)}
              content={ship?.usageType ?? undefined}
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.imoNumber)}
              content={ship?.imoNumber ?? undefined}
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
                content: registrationTabContent,
              },
              {
                label: formatMessage(shipsMessages.certificatesTab),
                content: (
                  <EmptyState description={shipsMessages.certificatesEmpty} />
                ),
              },
            ]}
          />
        )}
      </Stack>
    </IntroWrapperV2>
  )
}

export default ShipDetail
