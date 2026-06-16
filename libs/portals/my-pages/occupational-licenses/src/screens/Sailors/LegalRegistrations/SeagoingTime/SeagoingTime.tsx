import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridRow,
  Pagination,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  CardLoader,
  NestedTable,
  Table,
  createColumnHelper,
  formatDate,
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
import { useShipRegistrySailorSeagoingTimeQuery } from './SeagoingTime.generated'

const PAGE_SIZE = 20

type SeaServiceState = {
  pendingDateFrom?: Date
  pendingDateTo?: Date
  pendingRankId?: string
  activeDateFrom?: Date
  activeDateTo?: Date
  activeRankId?: string
  page?: number
}

const columnHelper = createColumnHelper<ShipRegistrySailorCrewRegistration>()

export const SeagoingTime = () => {
  const { formatMessage, locale } = useLocale()
  const [state, setState] = useState<SeaServiceState>({})

  const patchState = (patch: Partial<SeaServiceState>) =>
    setState((s) => ({ ...s, ...patch }))

  const { data, loading, error } = useShipRegistrySailorSeagoingTimeQuery({
    variables: {
      input: {
        pageNumber: state.page ?? 1,
        pageSize: PAGE_SIZE,
        dateFrom: state.activeDateFrom?.toISOString(),
        dateTo: state.activeDateTo?.toISOString(),
        rankId: state.activeRankId ? Number(state.activeRankId) : undefined,
      },
      locale: locale === 'en' ? LocaleEnum.En : LocaleEnum.Is,
    },
  })

  const seagoingTime = data?.shipRegistrySailor?.seagoingTime
  const entries = seagoingTime?.data ?? []
  const totalCount = seagoingTime?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const rankOptions = useMemo(() => {
    const all = {
      label: formatMessage(om.sailorSeaServiceRankAll),
      value: '',
    }
    const ranks = (data?.shipRegistryRanks ?? []).map((r) => ({
      label: r.name,
      value: r.id,
    }))
    return [all, ...ranks]
  }, [data?.shipRegistryRanks, formatMessage])

  const selectedRank = rankOptions.find(
    (o) => o.value === (state.pendingRankId ?? ''),
  )

  const valueLabels = useMemo(() => {
    const labels = seagoingTime?.valueLabels ?? []
    return Object.fromEntries(labels.map((vl) => [vl.entryField, vl.label]))
  }, [seagoingTime?.valueLabels])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueLabels],
  )

  const renderExpanded = (row: Row<ShipRegistrySailorCrewRegistration>) => {
    const { shipRegistrationNumber, length, grossTonnage, mainEngine } =
      row.original

    return (
      <NestedTable
        data={[
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
            value: formatValueUnit(length),
          },
          {
            title:
              valueLabels[
                ShipRegistrySailorCrewRegistrationField.GROSS_TONNAGE
              ] ?? '',
            value: formatValueUnit(grossTonnage),
          },
          {
            title:
              valueLabels[
                ShipRegistrySailorCrewRegistrationField.MAIN_ENGINE
              ] ?? '',
            value: formatValueUnit(mainEngine),
          },
        ]}
      />
    )
  }

  return (
    <Stack space={4}>
      {/* Stats card */}
      <Box
        border="standard"
        borderRadius="large"
        padding={3}
        display="flex"
        flexWrap="wrap"
        columnGap={6}
        rowGap={3}
      >
        {[
          {
            label: formatMessage(om.sailorSeaServiceTotalCrewDays),
            value: seagoingTime?.totalCrewRegistrationDayCount,
          },
          {
            label: formatMessage(om.sailorSeaServiceServiceDays),
            value: seagoingTime?.seaServiceDayCount,
          },
          {
            label: formatMessage(om.sailorSeaServiceWorkAshoreDays),
            value: seagoingTime?.workAshoreDayCount,
          },
          {
            label: formatMessage(om.sailorSeaServiceTotalWorkDays),
            value: seagoingTime?.totalWorkDays,
          },
        ].map(({ label, value }) => (
          <Box key={label} display="flex" flexDirection="column" rowGap={1}>
            <Text variant="small">{label}</Text>
            <Text variant="h3">{value ?? '-'}</Text>
          </Box>
        ))}
      </Box>

      {/* Filters */}
      <GridRow>
        <GridColumn span={['12/12', '3/12']}>
          <DatePicker
            label={formatMessage(om.sailorSeaServiceDateFrom)}
            placeholderText=""
            locale="is"
            backgroundColor="blue"
            selected={state.pendingDateFrom}
            handleChange={(d) => patchState({ pendingDateFrom: d })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '3/12']}>
          <DatePicker
            label={formatMessage(om.sailorSeaServiceDateTo)}
            placeholderText=""
            locale="is"
            backgroundColor="blue"
            selected={state.pendingDateTo}
            handleChange={(d) => patchState({ pendingDateTo: d })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '3/12']}>
          <Select
            label={formatMessage(om.sailorSeaServiceRank)}
            name="seaServiceRank"
            options={rankOptions}
            value={selectedRank}
            onChange={(opt) => patchState({ pendingRankId: opt?.value ?? '' })}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '3/12']}>
          <Box display="flex" alignItems="flexEnd" height="full">
            <Button
              onClick={() =>
                patchState({
                  activeDateFrom: state.pendingDateFrom,
                  activeDateTo: state.pendingDateTo,
                  activeRankId: state.pendingRankId,
                  page: 1,
                })
              }
            >
              {formatMessage(om.sailorSeaServiceSearchButton)}
            </Button>
          </Box>
        </GridColumn>
      </GridRow>

      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && entries.length === 0 && (
        <Problem type="no_data" noBorder={false} />
      )}
      {!loading && !error && entries.length > 0 && (
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
                  <button
                    className={className}
                    onClick={() => patchState({ page })}
                  >
                    {children}
                  </button>
                )}
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  )
}
