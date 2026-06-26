import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Divider,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  CardLoader,
  NestedLines,
  NestedTable,
  Table,
  createColumnHelper,
  formatDate,
  useIsMobile,
  type Row,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { LocaleEnum } from '@island.is/api/schema'
import { olMessage as om } from '../../../../lib/messages'
import { formatValueUnit } from '../../../../lib/utils'
import {
  ShipRegistrySailorCrewRegistration,
  ShipRegistrySailorCrewRegistrationField,
} from '@island.is/api/schema'
import { useShipRegistrySailorSeagoingTimeLazyQuery } from './SeagoingTime.generated'
import * as styles from './SeagoingTime.css'
import { SeagoingTimeFilters } from './SeagoingTimeFilters'
import { DEFAULT_PAGE_SIZE, SeaServiceState, defaultState } from './types'

const columnHelper = createColumnHelper<ShipRegistrySailorCrewRegistration>()

export const SeagoingTime = () => {
  const { formatMessage, locale } = useLocale()
  const [state, setState] = useState<SeaServiceState>(defaultState)
  const { isMobile } = useIsMobile()

  const patchState = (patch: Partial<SeaServiceState>) =>
    setState((s) => ({ ...s, ...patch }))

  const [execute, { data, loading, error, called }] =
    useShipRegistrySailorSeagoingTimeLazyQuery()

  const buildInput = (s: SeaServiceState) => ({
    pageNumber: s.page ?? 1,
    pageSize: s.pageSize ?? DEFAULT_PAGE_SIZE,
    dateFrom: s.dateFrom?.toISOString(),
    dateTo: s.dateTo?.toISOString(),
    rankId: s.rankId ? Number(s.rankId) : undefined,
    minimumLength:
      s.length && !isNaN(Number(s.length)) ? Number(s.length) : undefined,
    minimumEnginePower:
      s.power && !isNaN(Number(s.power)) ? Number(s.power) : undefined,
    minimumGrossTonnage:
      s.tonnage && !isNaN(Number(s.tonnage)) ? Number(s.tonnage) : undefined,
  })

  const handleSearch = (overrides?: Partial<SeaServiceState>) => {
    const merged = overrides ? { ...state, ...overrides } : state
    if (overrides) patchState(overrides)
    execute({
      variables: {
        input: buildInput(merged),
        locale: locale === 'en' ? LocaleEnum.En : LocaleEnum.Is,
      },
    })
  }

  useEffect(() => {
    execute({
      variables: {
        input: buildInput(defaultState),
        locale: locale === 'en' ? LocaleEnum.En : LocaleEnum.Is,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const seagoingTime = data?.shipRegistrySailor?.seagoingTime
  const entries = seagoingTime?.data ?? []
  const totalCount = seagoingTime?.totalCount ?? 0
  const totalPages = Math.ceil(
    totalCount / (state.pageSize ?? DEFAULT_PAGE_SIZE),
  )

  const valueLabels = useMemo(() => {
    const labels = seagoingTime?.valueLabels ?? []
    return Object.fromEntries(labels.map((vl) => [vl.entryField, vl.label]))
  }, [seagoingTime?.valueLabels])

  const statsItems = useMemo(
    () =>
      seagoingTime
        ? [
            {
              label: formatMessage(om.sailorSeaServiceTotalCrewDays),
              value: seagoingTime.totalCrewRegistrationDayCount,
            },
            {
              label: formatMessage(om.sailorSeaServiceServiceDays),
              value: seagoingTime.seaServiceDayCount,
            },
            {
              label: formatMessage(om.sailorSeaServiceWorkAshoreDays),
              value: seagoingTime.workAshoreDayCount,
            },
            {
              label: formatMessage(om.sailorSeaServiceTotalWorkDays),
              value: seagoingTime.totalWorkDays,
            },
          ]
        : null,
    [seagoingTime, formatMessage],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('shipName', {
        header:
          valueLabels[ShipRegistrySailorCrewRegistrationField.SHIP_NAME] ?? '',
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('rank', {
        header: valueLabels[ShipRegistrySailorCrewRegistrationField.RANK] ?? '',
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('startDate', {
        header:
          valueLabels[ShipRegistrySailorCrewRegistrationField.START_DATE] ?? '',
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      columnHelper.accessor('endDate', {
        header:
          valueLabels[ShipRegistrySailorCrewRegistrationField.END_DATE] ?? '',
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      columnHelper.accessor('numberOfDays', {
        header:
          valueLabels[ShipRegistrySailorCrewRegistrationField.NUMBER_OF_DAYS] ??
          '',
        cell: ({ getValue }) => getValue() ?? '-',
      }),
    ],
    [valueLabels],
  )

  const renderExpanded = (row: Row<ShipRegistrySailorCrewRegistration>) => {
    const { shipRegistrationNumber, length, grossTonnage, mainEngine } =
      row.original

    const nestedData = [
      {
        title:
          valueLabels[
            ShipRegistrySailorCrewRegistrationField.SHIP_REGISTRATION_NUMBER
          ] ?? formatMessage(om.sailorCrewRegistrationsExpandShipNo),
        value: shipRegistrationNumber ?? '-',
      },
      {
        title:
          valueLabels[ShipRegistrySailorCrewRegistrationField.LENGTH] ?? '',
        value: formatValueUnit(length, { locale }),
      },
      {
        title:
          valueLabels[ShipRegistrySailorCrewRegistrationField.GROSS_TONNAGE] ??
          '',
        value: formatValueUnit(grossTonnage, { locale, omitUnit: true }),
      },
      {
        title:
          valueLabels[ShipRegistrySailorCrewRegistrationField.MAIN_ENGINE] ??
          '',
        value: formatValueUnit(mainEngine, { locale }),
      },
    ]

    if (isMobile) {
      return (
        <>
          <Box paddingTop={3} paddingBottom={2}>
            <Divider />
          </Box>
          <NestedLines data={nestedData} />
        </>
      )
    }
    return <NestedTable data={nestedData} />
  }

  return (
    <Stack space={4}>
      {/* Stats card */}
      {statsItems && (
        <Box
          border="standard"
          borderRadius="large"
          padding={3}
          display="flex"
          flexWrap="wrap"
          rowGap={3}
        >
          {statsItems.map(({ label, value }, index) => (
            <Box
              key={label}
              display="flex"
              flexDirection="column"
              rowGap={1}
              paddingLeft={
                (isMobile ? index % 2 !== 0 : index > 0) ? 4 : undefined
              }
              paddingRight={4}
              borderLeftWidth={
                (isMobile ? index % 2 !== 0 : index > 0)
                  ? 'standard'
                  : undefined
              }
              borderColor="blue200"
              className={styles.statsItem}
            >
              <Text variant="small">{label}</Text>
              <Text variant="h3">{value ?? '-'}</Text>
            </Box>
          ))}
        </Box>
      )}
      {/* Filters */}
      <SeagoingTimeFilters
        state={state}
        patchState={patchState}
        onSearch={handleSearch}
        ranks={data?.shipRegistryRanks ?? []}
        onClear={() => setState(defaultState)}
      />
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && called && entries.length === 0 && (
        <Problem type="no_data" noBorder={false} />
      )}
      {!loading && !error && called && entries.length > 0 && (
        <>
          <Table
            columns={columns}
            data={entries}
            emptyMessage={om.sailorSeaServiceEmpty}
            mobileTitleKey="shipName"
            renderExpandedRow={renderExpanded}
          />
          {totalPages > 1 && (
            <Box marginTop={3}>
              <Pagination
                page={state.page ?? 1}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    component="button"
                    onClick={() => handleSearch({ page })}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  )
}
