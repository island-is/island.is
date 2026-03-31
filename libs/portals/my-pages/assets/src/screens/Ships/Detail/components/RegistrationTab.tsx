import { useLocale } from '@island.is/localization'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { TableGrid } from '@island.is/portals/my-pages/core'
import { shipsMessages } from '../../../../lib/messages'
import { ShipDetailQuery } from '../ShipDetail.generated'

const formatMeasurement = (value?: string | null, unit?: string | null) => {
  if (!value) return undefined
  return unit ? `${value} ${unit}` : value
}

interface Props {
  ship?: ShipDetailQuery['shipRegistryUserShip']
  loading: boolean
}

export const RegistrationTab = ({ ship, loading }: Props) => {
  const { formatMessage } = useLocale()
  const renderableEngines = (ship?.engines ?? []).filter((e) => e.name?.value)

  return (
    <Box marginTop={4}>
      {ship?.fishery && (
        <TableGrid
          title={formatMessage(shipsMessages.operatorTitle)}
          loading={loading}
          dataArray={[
            [
              {
                title:
                  ship.fishery.name?.label ??
                  formatMessage(shipsMessages.operatorName),
                value: ship.fishery.name?.value ?? '-',
              },
              {
                title:
                  ship.fishery.address?.label ??
                  formatMessage(shipsMessages.operatorAddress),
                value: ship.fishery.address?.value ?? '-',
              },
            ],
            [
              {
                title:
                  ship.fishery.municipality?.label ??
                  formatMessage(shipsMessages.operatorLocation),
                value: ship.fishery.municipality?.value ?? '-',
              },
            ],
          ]}
        />
      )}
      <TableGrid
        title={formatMessage(shipsMessages.constructionTitle)}
        loading={loading}
        mt={!!ship?.fishery}
        dataArray={[
          [
            {
              title:
                ship?.constructionStation?.label ??
                formatMessage(shipsMessages.constructionYard),
              value: ship?.constructionStation?.value ?? '-',
            },
            {
              title:
                ship?.constructionYear?.label ??
                formatMessage(shipsMessages.constructionYear),
              value: ship?.constructionYear?.value ?? '-',
            },
          ],
          [
            {
              title:
                ship?.hullMaterial?.label ??
                formatMessage(shipsMessages.hullMaterial),
              value: ship?.hullMaterial?.value ?? '-',
            },
            {
              title:
                ship?.classificationSociety?.label ??
                formatMessage(shipsMessages.classification),
              value: ship?.classificationSociety?.value ?? '-',
            },
          ],
        ]}
      />
      {ship?.measurements && (
        <TableGrid
          title={formatMessage(shipsMessages.measurementsTitle)}
          loading={loading}
          mt
          dataArray={[
            [
              {
                title:
                  ship.measurements.length?.label ??
                  formatMessage(shipsMessages.registeredLength),
                value:
                  formatMeasurement(
                    ship.measurements.length?.value,
                    ship.measurements.length?.unit,
                  ) ?? '-',
              },
              {
                title:
                  ship.measurements.maxLength?.label ??
                  formatMessage(shipsMessages.maxLength),
                value:
                  formatMeasurement(
                    ship.measurements.maxLength?.value,
                    ship.measurements.maxLength?.unit,
                  ) ?? '-',
              },
            ],
            [
              {
                title:
                  ship.measurements.width?.label ??
                  formatMessage(shipsMessages.width),
                value:
                  formatMeasurement(
                    ship.measurements.width?.value,
                    ship.measurements.width?.unit,
                  ) ?? '-',
              },
              {
                title:
                  ship.measurements.bruttoGrossTonnage?.label ??
                  formatMessage(shipsMessages.grossTonnage),
                value:
                  formatMeasurement(
                    ship.measurements.bruttoGrossTonnage?.value,
                    ship.measurements.bruttoGrossTonnage?.unit,
                  ) ?? '-',
              },
            ],
            [
              {
                title:
                  ship.measurements.bruttoWeight?.label ??
                  formatMessage(shipsMessages.bruttoWeight),
                value:
                  formatMeasurement(
                    ship.measurements.bruttoWeight?.value,
                    ship.measurements.bruttoWeight?.unit,
                  ) ?? '-',
              },
              {
                title:
                  ship.measurements.depth?.label ??
                  formatMessage(shipsMessages.depth),
                value:
                  formatMeasurement(
                    ship.measurements.depth?.value,
                    ship.measurements.depth?.unit,
                  ) ?? '-',
              },
            ],
          ]}
        />
      )}
      {renderableEngines.length > 0 && (
        <Box marginTop={6}>
          {renderableEngines.length > 1 && (
            <Text variant="h5">
              {formatMessage(shipsMessages.enginesTitle)}
            </Text>
          )}
          <Stack space={2}>
            {renderableEngines.map((engine, i) => (
              <Box key={i} marginTop={2}>
                <TableGrid
                  title={`${engine.name?.label}: ${engine.name?.value}`}
                  loading={loading}
                  dataArray={[
                    [
                      {
                        title:
                          engine.power?.label ??
                          formatMessage(shipsMessages.enginePower),
                        value:
                          formatMeasurement(
                            engine.power?.value,
                            engine.power?.unit,
                          ) ?? '-',
                      },
                      {
                        title:
                          engine.year?.label ??
                          formatMessage(shipsMessages.engineYear),
                        value: engine.year?.value ?? '-',
                      },
                    ],
                  ]}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}
