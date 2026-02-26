import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  InfoLine,
  InfoLineStack,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Box, Stack, Tag, Tabs } from '@island.is/island-ui/core'
import { shipsMessages } from '../../../lib/messages'
import { useShipDetailQuery } from './ShipDetail.generated'

export const ShipDetail = () => {
  useNamespaces('sp.ships')
  const { formatMessage } = useLocale()
  const { id } = useParams()

  const { data, loading, error } = useShipDetailQuery({
    variables: { input: { id: id ?? '' } },
  })

  const ship = data?.shipRegistryUserShip

  const registrationTabContent = (
    <Stack space={3}>
      {ship?.fishery && (
        <InfoLineStack label={formatMessage(shipsMessages.operatorTitle)}>
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.operatorName)}
            content={ship.fishery.name}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.operatorAddress)}
            content={ship.fishery.address}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(shipsMessages.operatorLocation)}
            content={ship.fishery.postalCode}
          />
        </InfoLineStack>
      )}

      <InfoLineStack label={formatMessage(shipsMessages.constructionTitle)}>
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.constructionYard)}
          content={ship?.constructionStation}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.constructionYear)}
          content={ship?.constructionYear?.toString()}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.hullMaterial)}
          content={ship?.hullMaterial}
        />
        <InfoLine
          loading={loading}
          label={formatMessage(shipsMessages.classification)}
          content={ship?.classificationSociety}
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
          label={`${formatMessage(shipsMessages.enginesTitle)}${engine.manufacturer ? ` / ${engine.manufacturer}` : ''}`}
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
    <IntroWrapper
      title={ship?.name ?? formatMessage(shipsMessages.title)}
      intro={formatMessage(shipsMessages.intro)}
      serviceProviderSlug={SAMGONGUSTOFA_SLUG}
      serviceProviderTooltip={formatMessage(shipsMessages.tooltip)}
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
              content={ship?.id}
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.districtLetters)}
              content={ship?.identification?.regionAcronym}
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.shipType)}
              content={ship?.usageType}
            />
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.imoNumber)}
              content={ship?.imoNumber}
            />
          </InfoLineStack>
        </Box>

        {(ship || loading) && (
          <Tabs
            label={`${formatMessage(shipsMessages.registrationTab)} / ${formatMessage(shipsMessages.certificatesTab)}`}
            contentBackground="white"
            tabs={[
              {
                label: formatMessage(shipsMessages.registrationTab),
                content: registrationTabContent,
              },
              {
                label: formatMessage(shipsMessages.certificatesTab),
                content: <Box />,
              },
            ]}
          />
        )}
      </Stack>
    </IntroWrapper>
  )
}

export default ShipDetail
