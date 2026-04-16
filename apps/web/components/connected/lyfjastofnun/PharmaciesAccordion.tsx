import { useState } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { parseAsStringEnum, useQueryState } from 'next-usequerystate'

import {
  Accordion,
  AccordionItem,
  Box,
  Filter,
  FilterMultiChoice,
  GridColumn,
  GridRow,
  Input,
  LinkV2,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  IcelandicMedicinesAgencyPharmacyRegion,
  Query,
} from '@island.is/web/graphql/schema'

import { isDefined } from '@island.is/shared/utils'

import { GET_PHARMACIES } from './queries'
import { m } from './translation.strings'

interface Props {
  slice: ConnectedComponent
}

const REGION_LABEL_MAP: Record<
  IcelandicMedicinesAgencyPharmacyRegion,
  MessageDescriptor
> = {
  [IcelandicMedicinesAgencyPharmacyRegion.Hofudborgarsvaedid]: m.regionCapital,
  [IcelandicMedicinesAgencyPharmacyRegion.SudurlandOgReykjanes]: m.regionSouth,
  [IcelandicMedicinesAgencyPharmacyRegion.VesturlandOgVestfirdir]: m.regionWest,
  [IcelandicMedicinesAgencyPharmacyRegion.Nordurland]: m.regionNorth,
  [IcelandicMedicinesAgencyPharmacyRegion.Austurland]: m.regionEast,
}

const PharmaciesAccordion = ({ slice }: Props) => {
  const { formatMessage } = useIntl()
  const { data, loading, error } = useQuery<Query>(GET_PHARMACIES, {
    onError(error) {
      console.error('Error fetching pharmacies:', error)
    },
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useQueryState(
    'region',
    parseAsStringEnum<IcelandicMedicinesAgencyPharmacyRegion>(
      Object.values(IcelandicMedicinesAgencyPharmacyRegion),
    ),
  )

  if (loading) {
    return (
      <Box display="flex" marginTop={4} justifyContent="center">
        <LoadingDots />
      </Box>
    )
  }

  if (error) {
    return null
  }

  const pharmacies = data?.icelandicMedicinesAgencyPharmacies?.data ?? []

  const uniqueRegions = [
    ...new Set(pharmacies.map((p) => p.region).filter(isDefined)),
  ]

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch = pharmacy.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesRegion =
      selectedRegion == null || pharmacy.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <Stack space={3}>
      <Filter
        variant="popover"
        reverse
        align="left"
        filterInput={
          <Input
            name="pharmacy-search"
            placeholder={formatMessage(m.searchPlaceholder)}
            aria-label={formatMessage(m.searchPlaceholder)}
            backgroundColor="blue"
            size="xs"
            icon={{ name: 'search', type: 'outline' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        }
        labelOpen={formatMessage(m.filterOpen)}
        labelClear={formatMessage(m.filterClear)}
        labelClearAll={formatMessage(m.filterClear)}
        filterCount={selectedRegion ? 1 : 0}
        onFilterClear={() => setSelectedRegion(null)}
      >
        <FilterMultiChoice
          labelClear={formatMessage(m.filterClear)}
          onChange={({ selected }) =>
            setSelectedRegion(
              (selected[0] as IcelandicMedicinesAgencyPharmacyRegion) ?? null,
            )
          }
          onClear={() => setSelectedRegion(null)}
          categories={[
            {
              id: 'region',
              label: formatMessage(m.regionLabel),
              selected: selectedRegion ? [selectedRegion] : [],
              singleOption: true,
              filters: uniqueRegions.map((region) => ({
                value: region,
                label: formatMessage(REGION_LABEL_MAP[region]),
              })),
            },
          ]}
        />
      </Filter>

      {filteredPharmacies.length === 0 ? (
        <Text>{formatMessage(m.noResults)}</Text>
      ) : (
        <Accordion>
          {filteredPharmacies.map((pharmacy) => (
            <AccordionItem
              key={pharmacy.id}
              id={pharmacy.id}
              label={pharmacy.name}
            >
              <GridRow rowGap={3}>
                <GridColumn span={['1/1', '1/2']}>
                  <Stack space={2}>
                    {pharmacy.address && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(m.address)}
                        </Text>
                        <Text>{pharmacy.address}</Text>
                      </Box>
                    )}
                    {(pharmacy.postalCode || pharmacy.city) && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(m.postalAddress)}
                        </Text>
                        <Text>
                          {[pharmacy.postalCode, pharmacy.city]
                            .filter(Boolean)
                            .join(' ')}
                        </Text>
                      </Box>
                    )}
                    {pharmacy.phone && (
                      <Box>
                        <Text variant="eyebrow">{formatMessage(m.phone)}</Text>
                        <LinkV2
                          href={`tel:${pharmacy.phone}`}
                          color="blue600"
                          underlineVisibility="hover"
                          underline="small"
                        >
                          {pharmacy.phone}
                        </LinkV2>
                      </Box>
                    )}
                    {pharmacy.email && (
                      <Box>
                        <Text variant="eyebrow">{formatMessage(m.email)}</Text>
                        <LinkV2
                          href={`mailto:${pharmacy.email}`}
                          color="blue600"
                          underlineVisibility="hover"
                          underline="small"
                        >
                          {pharmacy.email}
                        </LinkV2>
                      </Box>
                    )}
                  </Stack>
                </GridColumn>
                <GridColumn span={['1/1', '1/2']}>
                  <Stack space={3}>
                    {pharmacy.licenseHolder && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(m.licenseHolder)}
                        </Text>
                        <Text>{pharmacy.licenseHolder}</Text>
                      </Box>
                    )}
                    {pharmacy.operator && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(m.operator)}
                        </Text>
                        <Stack space={0}>
                          {pharmacy.operator.name && (
                            <Text>{pharmacy.operator.name}</Text>
                          )}
                          {pharmacy.operator.address && (
                            <Text>{pharmacy.operator.address}</Text>
                          )}
                          {(pharmacy.operator.postalCode ||
                            pharmacy.operator.city) && (
                            <Text>
                              {[
                                pharmacy.operator.postalCode,
                                pharmacy.operator.city,
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            </Text>
                          )}
                          {pharmacy.operator.nationalId && (
                            <Text>
                              {formatMessage(m.nationalIdPrefix)}{' '}
                              {pharmacy.operator.nationalId}
                            </Text>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </GridColumn>
              </GridRow>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Stack>
  )
}

export default PharmaciesAccordion
