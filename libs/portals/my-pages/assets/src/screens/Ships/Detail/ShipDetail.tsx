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
import { Box, Stack, Tabs } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { shipsMessages } from '../../../lib/messages'
import { useShipDetailQuery } from './ShipDetail.generated'

const formatMeasurement = (value?: string | null, unit?: string | null) => {
  if (!value) return undefined
  return unit ? `${value} ${unit}` : value
}

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
            label={
              ship.fishery.name?.label ??
              formatMessage(shipsMessages.operatorName)
            }
            content={ship.fishery.name?.value ?? undefined}
          />
          <InfoLine
            loading={loading}
            label={
              ship.fishery.address?.label ??
              formatMessage(shipsMessages.operatorAddress)
            }
            content={ship.fishery.address?.value ?? undefined}
          />
          <InfoLine
            loading={loading}
            label={
              ship.fishery.municipality?.label ??
              formatMessage(shipsMessages.operatorLocation)
            }
            content={ship.fishery.municipality?.value ?? undefined}
          />
        </InfoLineStack>
      )}

      <InfoLineStack label={formatMessage(shipsMessages.constructionTitle)}>
        <InfoLine
          loading={loading}
          label={
            ship?.constructionStation?.label ??
            formatMessage(shipsMessages.constructionYard)
          }
          content={ship?.constructionStation?.value ?? undefined}
        />
        <InfoLine
          loading={loading}
          label={
            ship?.constructionYear?.label ??
            formatMessage(shipsMessages.constructionYear)
          }
          content={ship?.constructionYear?.value ?? undefined}
        />
        <InfoLine
          loading={loading}
          label={
            ship?.hullMaterial?.label ??
            formatMessage(shipsMessages.hullMaterial)
          }
          content={ship?.hullMaterial?.value ?? undefined}
        />
        <InfoLine
          loading={loading}
          label={
            ship?.classificationSociety?.label ??
            formatMessage(shipsMessages.classification)
          }
          content={ship?.classificationSociety?.value ?? undefined}
        />
      </InfoLineStack>

      {ship?.measurements && (
        <InfoLineStack label={formatMessage(shipsMessages.measurementsTitle)}>
          <InfoLine
            loading={loading}
            label={
              ship.measurements.length?.label ??
              formatMessage(shipsMessages.registeredLength)
            }
            content={formatMeasurement(
              ship.measurements.length?.value,
              ship.measurements.length?.unit,
            )}
          />
          <InfoLine
            loading={loading}
            label={
              ship.measurements.maxLength?.label ??
              formatMessage(shipsMessages.maxLength)
            }
            content={formatMeasurement(
              ship.measurements.maxLength?.value,
              ship.measurements.maxLength?.unit,
            )}
          />
          <InfoLine
            loading={loading}
            label={
              ship.measurements.width?.label ??
              formatMessage(shipsMessages.width)
            }
            content={formatMeasurement(
              ship.measurements.width?.value,
              ship.measurements.width?.unit,
            )}
          />
          <InfoLine
            loading={loading}
            label={
              ship.measurements.bruttoGrossTonnage?.label ??
              formatMessage(shipsMessages.grossTonnage)
            }
            content={formatMeasurement(
              ship.measurements.bruttoGrossTonnage?.value,
              ship.measurements.bruttoGrossTonnage?.unit,
            )}
          />
          <InfoLine
            loading={loading}
            label={
              ship.measurements.bruttoWeight?.label ??
              formatMessage(shipsMessages.bruttoWeight)
            }
            content={formatMeasurement(
              ship.measurements.bruttoWeight?.value,
              ship.measurements.bruttoWeight?.unit,
            )}
          />
          <InfoLine
            loading={loading}
            label={
              ship.measurements.depth?.label ??
              formatMessage(shipsMessages.depth)
            }
            content={formatMeasurement(
              ship.measurements.depth?.value,
              ship.measurements.depth?.unit,
            )}
          />
        </InfoLineStack>
      )}

      {ship?.engines?.map((engine, i) => (
        <InfoLineStack
          key={i}
          label={`${formatMessage(shipsMessages.enginesTitle)}${
            engine.name?.value ? ` / ${engine.name.value}` : ''
          }`}
        >
          <InfoLine
            loading={loading}
            label={
              engine.power?.label ?? formatMessage(shipsMessages.enginePower)
            }
            content={formatMeasurement(engine.power?.value, engine.power?.unit)}
          />
          <InfoLine
            loading={loading}
            label={
              engine.year?.label ?? formatMessage(shipsMessages.engineYear)
            }
            content={engine.year?.value ?? undefined}
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
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !ship && (
        <EmptyState description={shipsMessages.notFound} />
      )}

      <Stack space={3}>
        <Box background="blue100" padding={[2, 3, 4]} borderRadius="large">
          <InfoLineStack>
            <InfoLine
              loading={loading}
              label={formatMessage(shipsMessages.registrationNumber)}
              content={ship?.registrationNumber?.toString()}
            />
            <InfoLine
              loading={loading}
              label={ship?.region?.label ?? formatMessage(shipsMessages.region)}
              content={ship?.region?.value ?? undefined}
            />
            <InfoLine
              loading={loading}
              label={
                ship?.usageType?.label ?? formatMessage(shipsMessages.shipType)
              }
              content={ship?.usageType?.value ?? undefined}
            />
            <InfoLine
              loading={loading}
              label={
                ship?.imoNumber?.label ?? formatMessage(shipsMessages.imoNumber)
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
