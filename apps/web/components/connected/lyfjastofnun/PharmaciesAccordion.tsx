import { useState } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import { createParser, useQueryState } from 'next-usequerystate'
import { useQuery } from '@apollo/client'

import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  Input,
  LinkV2,
  LoadingDots,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import {
  IcelandicMedicinesAgencyPharmacyRegion,
  Query,
} from '@island.is/web/graphql/schema'

import { GET_PHARMACIES } from './queries'
import { m } from './translation.strings'

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

const regionParser = createParser<IcelandicMedicinesAgencyPharmacyRegion>({
  parse(s) {
    return (
      Object.values(IcelandicMedicinesAgencyPharmacyRegion).find(
        (v) => v.toLowerCase() === s,
      ) ?? null
    )
  },
  serialize: (v) => v.toLowerCase(),
})

const PharmaciesAccordion = () => {
  const { formatMessage } = useIntl()
  const { data, loading, error } = useQuery<Query>(GET_PHARMACIES)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useQueryState(
    'region',
    regionParser,
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
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(query) ||
      (pharmacy.licenseHolder ?? '').toLowerCase().includes(query) ||
      (pharmacy.address ?? '').toLowerCase().includes(query)
    const matchesRegion =
      selectedRegion == null || pharmacy.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <Stack space={3}>
      <GridRow alignItems="center" rowGap={[2, 0, 0]}>
        <GridColumn span={['12/12', '6/12', '6/12']}>
          <Input
            name="pharmacy-search"
            placeholder={formatMessage(m.searchPlaceholder)}
            label={formatMessage(m.search)}
            backgroundColor="blue"
            size="xs"
            icon={{ name: 'search', type: 'outline' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12']}>
          <Select
            name="pharmacy-region"
            label={formatMessage(m.regionLabel)}
            backgroundColor="blue"
            size="xs"
            options={[
              { value: '', label: formatMessage(m.regionAll) },
              ...uniqueRegions.map((region) => ({
                value: region,
                label: formatMessage(REGION_LABEL_MAP[region]),
              })),
            ]}
            value={
              selectedRegion
                ? {
                    value: selectedRegion,
                    label: formatMessage(REGION_LABEL_MAP[selectedRegion]),
                  }
                : { value: '', label: formatMessage(m.regionAll) }
            }
            onChange={(option) =>
              setSelectedRegion(
                (option?.value as IcelandicMedicinesAgencyPharmacyRegion) ||
                  null,
              )
            }
          />
        </GridColumn>
      </GridRow>

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
                <GridColumn span={['12/12', '6/12']}>
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
                <GridColumn span={['12/12', '6/12']}>
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
