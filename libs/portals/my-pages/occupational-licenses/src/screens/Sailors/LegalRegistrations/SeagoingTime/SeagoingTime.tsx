import { useEffect, useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
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
import { useShipRegistrySailorSeagoingTimeLazyQuery } from './SeagoingTime.generated'
import * as styles from './SeagoingTime.css'

const DEFAULT_PAGE_SIZE = 25

const pageSizeOptions = [25, 50, 75, 100].map((n) => ({
  label: String(n),
  value: String(n),
}))

type SeaServiceState = {
  dateFrom?: Date
  dateTo?: Date
  rankId?: string
  length?: string
  power?: string
  tonnage?: string
  page?: number
  pageSize?: number
}

const defaultState: SeaServiceState = {}

const columnHelper = createColumnHelper<ShipRegistrySailorCrewRegistration>()

export const SeagoingTime = () => {
  const { formatMessage, locale } = useLocale()
  const [state, setState] = useState<SeaServiceState>(defaultState)

  const patchState = (patch: Partial<SeaServiceState>) =>
    setState((s) => ({ ...s, ...patch }))

  const [execute, { data, loading, error }] =
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

  const selectedRank = rankOptions.find((o) => o.value === (state.rankId ?? ''))

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
            value: formatValueUnit(length, { locale }),
          },
          {
            title:
              valueLabels[
                ShipRegistrySailorCrewRegistrationField.GROSS_TONNAGE
              ] ?? '',
            value: formatValueUnit(grossTonnage, { locale, omitUnit: true }),
          },
          {
            title:
              valueLabels[
                ShipRegistrySailorCrewRegistrationField.MAIN_ENGINE
              ] ?? '',
            value: formatValueUnit(mainEngine, { locale }),
          },
        ]}
      />
    )
  }

  return (
    <Stack space={4}>
      {/* Stats card */}
      {statsItems && (
        <Box border="standard" borderRadius="large" padding={3} display="flex">
          {statsItems.map(({ label, value }, index) => (
            <Box
              key={label}
              display="flex"
              flexDirection="column"
              rowGap={1}
              paddingLeft={index > 0 ? 4 : undefined}
              paddingRight={4}
              borderLeftWidth={index > 0 ? 'standard' : undefined}
              borderColor="blue200"
              style={{ flex: 1 }}
            >
              <Text variant="small">{label}</Text>
              <Text variant="h3">{value ?? '-'}</Text>
            </Box>
          ))}
        </Box>
      )}
      {/* Filters */}
      <GridRow rowGap={[2, 2, 2, 2, 3]}>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <DatePicker
            label={formatMessage(om.sailorSeaServiceDateFrom)}
            placeholderText=""
            locale="is"
            size="sm"
            backgroundColor="blue"
            selected={state.dateFrom}
            handleChange={(d) => patchState({ dateFrom: d })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <DatePicker
            label={formatMessage(om.sailorSeaServiceDateTo)}
            placeholderText=""
            locale="is"
            size="sm"
            backgroundColor="blue"
            selected={state.dateTo}
            handleChange={(d) => patchState({ dateTo: d })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Select
            label={formatMessage(om.sailorSeaServiceRank)}
            name="seaServiceRank"
            size="sm"
            options={rankOptions}
            value={selectedRank}
            onChange={(opt) => patchState({ rankId: opt?.value ?? '' })}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Input
            label={formatMessage(om.sailorSeaServiceMinLength)}
            placeholder={formatMessage(om.sailorSeaServiceMinLengthPlaceholder)}
            name="seaServiceMinLength"
            size="sm"
            type="number"
            backgroundColor="blue"
            value={state.length ?? ''}
            onChange={(e) => patchState({ length: e.target.value })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Input
            label={formatMessage(om.sailorSeaServiceMinPower)}
            placeholder={formatMessage(om.sailorSeaServiceMinPowerPlaceholder)}
            name="seaServiceMinPower"
            size="sm"
            type="number"
            backgroundColor="blue"
            value={state.power ?? ''}
            onChange={(e) => patchState({ power: e.target.value })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Input
            label={formatMessage(om.sailorSeaServiceMinTonnage)}
            placeholder={formatMessage(
              om.sailorSeaServiceMinTonnagePlaceholder,
            )}
            name="seaServiceMinTonnage"
            size="sm"
            type="number"
            backgroundColor="blue"
            value={state.tonnage ?? ''}
            onChange={(e) => patchState({ tonnage: e.target.value })}
          />
        </GridColumn>
      </GridRow>
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexEnd">
        <Box className={styles.searchButton}>
          <Button
            fluid
            onClick={() => {
              patchState({ page: 1 })
              execute({
                variables: {
                  input: buildInput({ ...state, page: 1 }),
                  locale: locale === 'en' ? LocaleEnum.En : LocaleEnum.Is,
                },
              })
            }}
          >
            {formatMessage(om.sailorSeaServiceSearchButton)}
          </Button>
        </Box>
        <Box className={styles.pageSizeSelect}>
          <Select
            label={formatMessage(om.sailorSeaServicePageSize)}
            name="seaServicePageSize"
            size="sm"
            backgroundColor="blue"
            options={pageSizeOptions}
            value={pageSizeOptions.find(
              (o) => o.value === String(state.pageSize ?? DEFAULT_PAGE_SIZE),
            )}
            onChange={(opt) => {
              const newPageSize = Number(opt?.value ?? DEFAULT_PAGE_SIZE)
              const newState = { ...state, pageSize: newPageSize, page: 1 }
              patchState({ pageSize: newPageSize, page: 1 })
              execute({
                variables: {
                  input: buildInput(newState),
                  locale: locale === 'en' ? LocaleEnum.En : LocaleEnum.Is,
                },
              })
            }}
          />
        </Box>
      </Box>
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
                  <Box
                    cursor="pointer"
                    className={className}
                    component="button"
                    onClick={() => {
                      const newState = { ...state, page }
                      patchState({ page })
                      execute({
                        variables: {
                          input: buildInput(newState),
                          locale:
                            locale === 'en' ? LocaleEnum.En : LocaleEnum.Is,
                        },
                      })
                    }}
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
