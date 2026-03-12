import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ShipRegistryLocale,
  ShipRegistryCertificateStatus,
} from '@island.is/api/schema'
import {
  CardLoader,
  EmptyState,
  IntroWrapperV2,
  InfoLine,
  InfoLineStack,
  TableGrid,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/portals/my-pages/core'
import {
  Box,
  Button,
  Icon,
  Input,
  Stack,
  Tag,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { shipsMessages } from '../../../lib/messages'
import { useShipDetailQuery } from './ShipDetail.generated'
import { isDefined } from '@island.is/shared/utils'

const formatMeasurement = (value?: string | null, unit?: string | null) => {
  if (!value) return undefined
  return unit ? `${value} ${unit}` : value
}

export const ShipDetail = () => {
  useNamespaces('sp.ships')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams()

  const [certSearch, setCertSearch] = useState('')
  const [expandedCerts, setExpandedCerts] = useState<Set<number>>(new Set())

  const { data, loading, error } = useShipDetailQuery({
    variables: {
      input: {
        id: id ?? '',
        locale: lang === 'en' ? ShipRegistryLocale.En : ShipRegistryLocale.Is,
      },
    },
  })

  const ship = data?.shipRegistryUserShip

  const toggleCert = (index: number) => {
    setExpandedCerts((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const filteredCerts = useMemo(() => {
    if (!certSearch.trim()) return ship?.certificates ?? []
    const lower = certSearch.toLowerCase()
    return (ship?.certificates ?? []).filter((c) =>
      c.name.toLowerCase().includes(lower),
    )
  }, [ship?.certificates, certSearch])

  const seaworthinessCertificateValidTo =
    ship?.seaworthinessCertificateValidTo ?? undefined

  const registrationTabContent = (
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
                value: ship.fishery.name?.value ?? '',
              },
              {
                title:
                  ship.fishery.address?.label ??
                  formatMessage(shipsMessages.operatorAddress),
                value: ship.fishery.address?.value ?? '',
              },
            ],
            [
              {
                title:
                  ship.fishery.municipality?.label ??
                  formatMessage(shipsMessages.operatorLocation),
                value: ship.fishery.municipality?.value ?? '',
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
              value: ship?.constructionStation?.value ?? '',
            },
            {
              title:
                ship?.constructionYear?.label ??
                formatMessage(shipsMessages.constructionYear),
              value: ship?.constructionYear?.value ?? '',
            },
          ],
          [
            {
              title:
                ship?.hullMaterial?.label ??
                formatMessage(shipsMessages.hullMaterial),
              value: ship?.hullMaterial?.value ?? '',
            },
            {
              title:
                ship?.classificationSociety?.label ??
                formatMessage(shipsMessages.classification),
              value: ship?.classificationSociety?.value ?? '',
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
                  ) ?? '',
              },
              {
                title:
                  ship.measurements.maxLength?.label ??
                  formatMessage(shipsMessages.maxLength),
                value:
                  formatMeasurement(
                    ship.measurements.maxLength?.value,
                    ship.measurements.maxLength?.unit,
                  ) ?? '',
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
                  ) ?? '',
              },
              {
                title:
                  ship.measurements.bruttoGrossTonnage?.label ??
                  formatMessage(shipsMessages.grossTonnage),
                value:
                  formatMeasurement(
                    ship.measurements.bruttoGrossTonnage?.value,
                    ship.measurements.bruttoGrossTonnage?.unit,
                  ) ?? '',
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
                  ) ?? '',
              },
              {
                title:
                  ship.measurements.depth?.label ??
                  formatMessage(shipsMessages.depth),
                value:
                  formatMeasurement(
                    ship.measurements.depth?.value,
                    ship.measurements.depth?.unit,
                  ) ?? '',
              },
            ],
          ]}
        />
      )}
      {(ship?.engines?.length ?? 0) > 0 && (
        <Box marginTop={6}>
          <Text variant="h5">{formatMessage(shipsMessages.enginesTitle)}</Text>
          <Stack space={2}>
            {ship?.engines
              ?.map((engine, i) => {
                if (!engine.name?.value) return null
                return (
                  <Box marginTop={2}>
                    <TableGrid
                      key={i}
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
                              ) ?? '',
                          },
                          {
                            title:
                              engine.year?.label ??
                              formatMessage(shipsMessages.engineYear),
                            value: engine.year?.value ?? '',
                          },
                        ],
                      ]}
                    />
                  </Box>
                )
              })
              .filter(isDefined)}
          </Stack>
        </Box>
      )}
    </Box>
  )

  const certificatesTabContent = (
    <Box marginTop={4}>
      <Stack space={3}>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Box style={{ maxWidth: 318, flex: 1 }}>
            <Input
              name="cert-search"
              placeholder={formatMessage(
                shipsMessages.certificatesSearchPlaceholder,
              )}
              value={certSearch}
              onChange={(e) => setCertSearch(e.target.value)}
              size="sm"
              backgroundColor="blue"
            />
          </Box>
          <Button
            variant="utility"
            icon="download"
            iconType="outline"
            size="small"
          >
            {formatMessage(shipsMessages.certificatesDownload)}
          </Button>
        </Box>

        {filteredCerts.length > 0 ? (
          <Box>
            {/* Header row */}
            <Box
              display="flex"
              alignItems="center"
              background="blue100"
              borderBottomWidth="standard"
              borderColor="blue200"
              borderStyle="solid"
            >
              <Box style={{ width: 56, flexShrink: 0 }} />
              <Box style={{ flex: 1 }} paddingY={2} paddingX={2}>
                <Text variant="small" fontWeight="semiBold">
                  {formatMessage(shipsMessages.certificatesType)}
                </Text>
              </Box>
              <Box
                style={{ width: 157, flexShrink: 0 }}
                paddingY={2}
                paddingX={2}
              >
                <Text variant="small" fontWeight="semiBold">
                  {formatMessage(shipsMessages.certificatesExpiry)}
                </Text>
              </Box>
              <Box
                style={{ width: 120, flexShrink: 0 }}
                paddingY={2}
                paddingX={2}
                display="flex"
                justifyContent="flexEnd"
              >
                <Text variant="small" fontWeight="semiBold">
                  {formatMessage(shipsMessages.certificatesStatus)}
                </Text>
              </Box>
            </Box>

            {filteredCerts.map((cert, index) => {
              const isOpen = expandedCerts.has(index)
              return (
                <Box key={`${cert.name}-${index}`}>
                  {/* Body row */}
                  <Box
                    display="flex"
                    alignItems="center"
                    background={isOpen ? 'blue100' : 'white'}
                    borderBottomWidth={!isOpen ? 'standard' : undefined}
                    borderColor="blue200"
                    borderStyle="solid"
                    style={
                      isOpen ? { borderLeft: '2px solid #0061ff' } : undefined
                    }
                  >
                    <Box
                      style={{ width: 56, flexShrink: 0 }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingY={2}
                      paddingX={2}
                    >
                      <Box
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="full"
                        background={isOpen ? 'white' : 'blue100'}
                        style={{ width: 24, height: 24 }}
                        onClick={() => toggleCert(index)}
                      >
                        <Icon
                          icon={isOpen ? 'remove' : 'add'}
                          size="small"
                          color="blue400"
                        />
                      </Box>
                    </Box>
                    <Box style={{ flex: 1 }} paddingY={2} paddingX={2}>
                      <Text variant="default">{cert.name}</Text>
                    </Box>
                    <Box
                      style={{ width: 157, flexShrink: 0 }}
                      paddingY={2}
                      paddingX={2}
                    >
                      <Text variant="default">{cert.validToDate}</Text>
                    </Box>
                    <Box
                      style={{ width: 120, flexShrink: 0 }}
                      paddingY={2}
                      paddingX={2}
                      display="flex"
                      justifyContent="flexEnd"
                    >
                      {cert.status !==
                        ShipRegistryCertificateStatus.Unknown && (
                        <Tag
                          outlined
                          variant={
                            cert.status ===
                            ShipRegistryCertificateStatus.Expired
                              ? 'red'
                              : 'mint'
                          }
                        >
                          {cert.status === ShipRegistryCertificateStatus.Expired
                            ? formatMessage(shipsMessages.expiredTag)
                            : formatMessage(shipsMessages.validTag)}
                        </Tag>
                      )}
                    </Box>
                  </Box>

                  {/* Sub-row (expanded details) */}
                  {isOpen && (
                    <Box
                      background="blue100"
                      paddingY={3}
                      paddingX={4}
                      borderBottomWidth="standard"
                      borderColor="blue200"
                      borderStyle="solid"
                      style={{ borderLeft: '2px solid #0061ff' }}
                    >
                      <Box display="flex" columnGap={4}>
                        <Box style={{ flex: 1 }}>
                          <Box display="flex" alignItems="center">
                            <Box
                              background="white"
                              style={{ flex: 1 }}
                              paddingY={1}
                              paddingX={2}
                            >
                              <Text variant="small" fontWeight="semiBold">
                                {formatMessage(
                                  shipsMessages.certificatesIssueDate,
                                )}
                              </Text>
                            </Box>
                            <Box
                              background="white"
                              style={{ flex: 1 }}
                              paddingY={1}
                              paddingX={2}
                            >
                              <Text variant="small">
                                {cert.issueDate || '-'}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                        <Box style={{ flex: 1 }}>
                          <Box display="flex" alignItems="center">
                            <Box
                              background="white"
                              style={{ flex: 1 }}
                              paddingY={1}
                              paddingX={2}
                            >
                              <Text variant="small" fontWeight="semiBold">
                                {formatMessage(
                                  shipsMessages.certificatesExtendedTo,
                                )}
                              </Text>
                            </Box>
                            <Box
                              background="white"
                              style={{ flex: 1 }}
                              paddingY={1}
                              paddingX={2}
                            >
                              <Text variant="small">
                                {cert.extensionDate || '-'}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        ) : (
          <EmptyState description={shipsMessages.certificatesEmpty} />
        )}
      </Stack>
    </Box>
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
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !ship && (
        <EmptyState description={shipsMessages.notFound} />
      )}

      <Stack space={3}>
        <Box>
          <InfoLineStack>
            {seaworthinessCertificateValidTo !== undefined && (
              <InfoLine
                loading={loading}
                label={formatMessage(shipsMessages.seaworthinessTitle)}
                content={
                  <Tag
                    outlined
                    variant={
                      new Date(seaworthinessCertificateValidTo) < new Date()
                        ? 'red'
                        : 'mint'
                    }
                  >
                    {new Date(seaworthinessCertificateValidTo) < new Date()
                      ? formatMessage(shipsMessages.expiredTag)
                      : formatMessage(shipsMessages.seaworthinessValidTo, {
                          date: seaworthinessCertificateValidTo,
                        })}
                  </Tag>
                }
              />
            )}
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
                content: certificatesTabContent,
              },
            ]}
          />
        )}
      </Stack>
    </IntroWrapperV2>
  )
}

export default ShipDetail
