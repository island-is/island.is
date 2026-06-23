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
  ConnectedComponent,
  IcelandicMedicinesAgencyPharmacyRegion,
  Query,
} from '@island.is/web/graphql/schema'

import { m as clinicStrings } from './medicalClinics.strings'
import { GET_MEDICAL_CLINICS, GET_PHARMACIES, GET_WHOLESALERS } from './queries'
import { m as pharmacyStrings } from './translation.strings'
import { m as wholesalerStrings } from './wholesalers.strings'

type Datasource = 'pharmacies' | 'medicalClinics' | 'wholesalers'

const isDatasource = (v: unknown): v is Datasource =>
  v === 'pharmacies' || v === 'medicalClinics' || v === 'wholesalers'

interface Props {
  slice: ConnectedComponent
}

const REGION_LABEL_MAP: Record<
  IcelandicMedicinesAgencyPharmacyRegion,
  MessageDescriptor
> = {
  [IcelandicMedicinesAgencyPharmacyRegion.Hofudborgarsvaedid]:
    pharmacyStrings.regionCapital,
  [IcelandicMedicinesAgencyPharmacyRegion.SudurlandOgReykjanes]:
    pharmacyStrings.regionSouth,
  [IcelandicMedicinesAgencyPharmacyRegion.VesturlandOgVestfirdir]:
    pharmacyStrings.regionWest,
  [IcelandicMedicinesAgencyPharmacyRegion.Nordurland]:
    pharmacyStrings.regionNorth,
  [IcelandicMedicinesAgencyPharmacyRegion.Austurland]:
    pharmacyStrings.regionEast,
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

const LyfjastofnunAccordion = ({ slice }: Props) => {
  const { formatMessage } = useIntl()
  const raw = slice.json?.datasource
  const datasource: Datasource = isDatasource(raw) ? raw : 'pharmacies'

  const {
    data: pharmacyData,
    loading: pharmacyLoading,
    error: pharmacyError,
  } = useQuery<Query>(GET_PHARMACIES, { skip: datasource !== 'pharmacies' })
  const {
    data: clinicData,
    loading: clinicLoading,
    error: clinicError,
  } = useQuery<Query>(GET_MEDICAL_CLINICS, {
    skip: datasource !== 'medicalClinics',
  })
  const {
    data: wholesalerData,
    loading: wholesalerLoading,
    error: wholesalerError,
  } = useQuery<Query>(GET_WHOLESALERS, { skip: datasource !== 'wholesalers' })

  const loading = pharmacyLoading || clinicLoading || wholesalerLoading
  const error = pharmacyError ?? clinicError ?? wholesalerError

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useQueryState(
    'region',
    regionParser,
  )

  const strings =
    datasource === 'pharmacies'
      ? pharmacyStrings
      : datasource === 'medicalClinics'
      ? clinicStrings
      : wholesalerStrings

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

  type Item = {
    id: string
    name: string
    address?: string | null
    postalCode?: string | null
    city?: string | null
    phone?: string | null
    fax?: string | null
    email?: string | null
    licenseHolder?: string | null
    region?: IcelandicMedicinesAgencyPharmacyRegion | null
    operator?: {
      name: string
      address?: string | null
      postalCode?: string | null
      city?: string | null
      phone?: string | null
      nationalId?: string | null
    } | null
    branches?: Array<{
      name: string
      address?: string | null
      postalCode?: string | null
      city?: string | null
      phone?: string | null
      fax?: string | null
      email?: string | null
      category?: string | null
    }> | null
  }

  const items: Item[] =
    datasource === 'pharmacies'
      ? pharmacyData?.icelandicMedicinesAgencyPharmacies?.data ?? []
      : datasource === 'medicalClinics'
      ? clinicData?.icelandicMedicinesAgencyMedicalClinics?.data ?? []
      : wholesalerData?.icelandicMedicinesAgencyWholesalers?.data ?? []

  const hasRegion = datasource !== 'wholesalers'
  const uniqueRegions = hasRegion
    ? [...new Set(items.map((i) => i.region).filter(isDefined))]
    : []

  const filtered = items.filter((item) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      (item.address ?? '').toLowerCase().includes(q)
    const matchesRegion =
      !hasRegion || selectedRegion == null || item.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <Stack space={3}>
      <GridRow alignItems="center" rowGap={[2, 0, 0]}>
        <GridColumn
          span={
            hasRegion && uniqueRegions.length > 0
              ? ['12/12', '6/12', '6/12']
              : ['12/12']
          }
        >
          <Input
            name="licensed-operation-search"
            placeholder={formatMessage(strings.searchPlaceholder)}
            label={formatMessage(strings.search)}
            backgroundColor="blue"
            size="xs"
            icon={{ name: 'search', type: 'outline' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </GridColumn>
        {hasRegion && uniqueRegions.length > 0 && (
          <GridColumn span={['12/12', '6/12', '6/12']}>
            <Select
              name="licensed-operation-region"
              label={formatMessage(pharmacyStrings.regionLabel)}
              backgroundColor="blue"
              size="xs"
              options={[
                { value: '', label: formatMessage(pharmacyStrings.regionAll) },
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
                  : {
                      value: '',
                      label: formatMessage(pharmacyStrings.regionAll),
                    }
              }
              onChange={(option) => {
                const region = Object.values(
                  IcelandicMedicinesAgencyPharmacyRegion,
                ).find((r) => r === option?.value)
                setSelectedRegion(region ?? null)
              }}
            />
          </GridColumn>
        )}
      </GridRow>

      {filtered.length === 0 ? (
        <Text>{formatMessage(strings.noResults)}</Text>
      ) : (
        <Accordion>
          {filtered.map((item) => (
            <AccordionItem key={item.id} id={item.id} label={item.name}>
              <GridRow rowGap={3}>
                <GridColumn span={['12/12', '6/12']}>
                  <Stack space={2}>
                    {item.address && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(pharmacyStrings.address)}
                        </Text>
                        <Text>{item.address}</Text>
                      </Box>
                    )}
                    {(item.postalCode || item.city) && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(pharmacyStrings.postalAddress)}
                        </Text>
                        <Text>
                          {[item.postalCode, item.city]
                            .filter(Boolean)
                            .join(' ')}
                        </Text>
                      </Box>
                    )}
                    {item.phone && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(pharmacyStrings.phone)}
                        </Text>
                        <LinkV2
                          href={`tel:${item.phone}`}
                          color="blue600"
                          underlineVisibility="hover"
                          underline="small"
                        >
                          {item.phone}
                        </LinkV2>
                      </Box>
                    )}
                    {item.email && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(pharmacyStrings.email)}
                        </Text>
                        <LinkV2
                          href={`mailto:${item.email}`}
                          color="blue600"
                          underlineVisibility="hover"
                          underline="small"
                        >
                          {item.email}
                        </LinkV2>
                      </Box>
                    )}
                  </Stack>
                </GridColumn>
                <GridColumn span={['12/12', '6/12']}>
                  <Stack space={3}>
                    {item.licenseHolder && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(pharmacyStrings.licenseHolder)}
                        </Text>
                        <Text>{item.licenseHolder}</Text>
                      </Box>
                    )}
                    {item.operator && (
                      <Box>
                        <Text variant="eyebrow">
                          {formatMessage(pharmacyStrings.operator)}
                        </Text>
                        <Stack space={0}>
                          {item.operator.name && (
                            <Text>{item.operator.name}</Text>
                          )}
                          {item.operator.address && (
                            <Text>{item.operator.address}</Text>
                          )}
                          {(item.operator.postalCode || item.operator.city) && (
                            <Text>
                              {[item.operator.postalCode, item.operator.city]
                                .filter(Boolean)
                                .join(' ')}
                            </Text>
                          )}
                          {item.operator.nationalId && (
                            <Text>
                              {formatMessage(pharmacyStrings.nationalIdPrefix)}{' '}
                              {item.operator.nationalId}
                            </Text>
                          )}
                        </Stack>
                      </Box>
                    )}
                    {item.branches && item.branches.length > 0 && (
                      <Box>
                        <Stack space={2}>
                          {item.branches.map((branch, i) => (
                            <Box key={i}>
                              <Text variant="eyebrow">{branch.name}</Text>
                              {branch.address && <Text>{branch.address}</Text>}
                              {(branch.postalCode || branch.city) && (
                                <Text>
                                  {[branch.postalCode, branch.city]
                                    .filter(Boolean)
                                    .join(' ')}
                                </Text>
                              )}
                              {branch.phone && (
                                <LinkV2
                                  href={`tel:${branch.phone}`}
                                  color="blue600"
                                  underlineVisibility="hover"
                                  underline="small"
                                >
                                  {branch.phone}
                                </LinkV2>
                              )}
                            </Box>
                          ))}
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

export default LyfjastofnunAccordion
