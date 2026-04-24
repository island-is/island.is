import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Table,
  createColumnHelper,
  m,
  formatNationalId,
  amountFormat,
  type Row,
  type SortingState,
  type OnChangeFn,
} from '@island.is/portals/my-pages/core'
import { SubsidiesFilter } from './SubsidiesFilter'
import { farmerLandsMessages as fm } from '../../../../lib/messages'
import {
  FarmerLandSubsidy,
  FarmerLandSubsidyOrderDirection,
  FarmerLandSubsidyOrderField,
} from '@island.is/api/schema'
import { useFarmerLandSubsidiesQuery } from './FarmerLandSubsidies.generated'

interface Props {
  farmId: string
}

type SubsidiesState = {
  cursor?: string
  contractId?: string
  paymentCategoryId?: number
  dateFrom?: Date
  dateTo?: Date
  orderField?: FarmerLandSubsidyOrderField
  orderDirection?: FarmerLandSubsidyOrderDirection
}

const DetailCell = ({
  children,
  label,
  white,
  gap,
  span = 1,
}: {
  children?: React.ReactNode
  label?: boolean
  white?: boolean
  gap?: boolean
  span?: number
}) => (
  <Box
    style={{ gridColumn: `span ${span}`, marginLeft: gap ? 16 : undefined }}
    background={white ? 'white' : undefined}
    paddingX={3}
    paddingY={2}
  >
    {children && (
      <Text variant="small" fontWeight={label ? 'semiBold' : 'regular'}>
        {children}
      </Text>
    )}
  </Box>
)

const DetailRow = ({ children }: { children: React.ReactNode }) => (
  <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
    {children}
  </Box>
)

const columnHelper = createColumnHelper<FarmerLandSubsidy>()

const fieldMap: Partial<Record<string, FarmerLandSubsidyOrderField>> = {
  paymentDate: FarmerLandSubsidyOrderField.PaymentDate,
  contract: FarmerLandSubsidyOrderField.Contract,
}

export const Subsidies = ({ farmId }: Props) => {
  const { formatMessage, locale } = useLocale()

  const [filters, setFilters] = useState<SubsidiesState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const { data, previousData, loading, error } = useFarmerLandSubsidiesQuery({
    variables: {
      input: {
        farmId,
        ...filters,
      },
    },
  })

  const pageInfo = data?.farmerLandSubsidies?.pageInfo
  const subsidies = useMemo(() => data?.farmerLandSubsidies?.data ?? [], [data])
  const filterOptions = (data ?? previousData)?.farmerLandSubsidies
    ?.filterOptions

  const contractItems = useMemo(
    () =>
      (filterOptions?.contracts ?? []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [filterOptions?.contracts],
  )

  const categoryItems = useMemo(
    () =>
      (filterOptions?.paymentCategories ?? []).map((pc) => ({
        value: String(pc.id),
        label: pc.name,
      })),
    [filterOptions?.paymentCategories],
  )

  const handleSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      setSorting((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        if (next.length === 0) {
          setFilters((f) => ({
            ...f,
            orderField: undefined,
            orderDirection: undefined,
            cursor: undefined,
          }))
        } else {
          const field = fieldMap[next[0].id]
          if (field) {
            setFilters((f) => ({
              ...f,
              cursor: undefined,
              orderField: field,
              orderDirection: next[0].desc
                ? FarmerLandSubsidyOrderDirection.Descending
                : FarmerLandSubsidyOrderDirection.Ascending,
            }))
          }
        }
        return next
      })
    },
    [],
  )

  const filterCount = [
    filters.contractId,
    filters.paymentCategoryId,
    filters.dateFrom ?? filters.dateTo,
  ].filter((v) => v != null).length

  const columns = useMemo(
    () => [
      columnHelper.accessor('paymentDate', {
        header: formatMessage(m.date),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? new Date(value).toLocaleDateString('is-IS') : ''
        },
      }),
      columnHelper.accessor('contract', {
        header: formatMessage(m.contract),
      }),
      columnHelper.accessor('grossAmount', {
        header: formatMessage(m.amount),
        enableSorting: false,
        cell: ({ getValue }) => amountFormat(getValue()),
      }),
      columnHelper.accessor('offset', {
        header: formatMessage(fm.subsidyOffset),
        enableSorting: false,
        cell: ({ getValue }) => amountFormat(getValue() ?? 0),
      }),
      columnHelper.accessor('netPaid', {
        header: formatMessage(fm.subsidyNetPaid),
        enableSorting: false,
        cell: ({ getValue }) => amountFormat(getValue()),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const renderExpandedRow = (row: Row<FarmerLandSubsidy>) => (
    <>
      <DetailRow>
        <DetailCell label white>
          {formatMessage(m.name)}
        </DetailCell>
        <DetailCell white>{row.original.name}</DetailCell>
        <DetailCell label white gap>
          {formatMessage(m.natreg)}
        </DetailCell>
        <DetailCell white>
          {formatNationalId(row.original.nationalId ?? '')}
        </DetailCell>
      </DetailRow>
      <DetailRow>
        <DetailCell label>{formatMessage(fm.subsidyUnits)}</DetailCell>
        <DetailCell>
          {row.original.units != null ? String(row.original.units) : ''}
        </DetailCell>
        <DetailCell label gap>
          {formatMessage(fm.subsidyUnitPrice)}
        </DetailCell>
        <DetailCell>{amountFormat(row.original.unitPrice)}</DetailCell>
      </DetailRow>
      <DetailRow>
        <DetailCell label white>
          {formatMessage(m.type)}
        </DetailCell>
        <DetailCell white span={3}>
          {row.original.paymentCategory}
        </DetailCell>
      </DetailRow>
    </>
  )

  return (
    <Box marginTop={4}>
      <Box marginBottom={3}>
        <SubsidiesFilter
          contractId={filters.contractId}
          paymentCategoryId={filters.paymentCategoryId}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          filterCount={filterCount}
          contractItems={contractItems}
          categoryItems={categoryItems}
          onContractChange={(value) => {
            setFilters({
              ...filters,
              contractId: value,
              cursor: undefined,
            })
          }}
          onCategoryChange={(value) => {
            setFilters({
              ...filters,
              paymentCategoryId: value,
              cursor: undefined,
            })
          }}
          onDateChange={(start, end) => {
            setFilters({
              ...filters,
              dateFrom: start,
              dateTo: end,
              cursor: undefined,
            })
          }}
          onClear={() => {
            setFilters({})
            setSorting([])
          }}
        />
      </Box>
      <Table
        columns={columns}
        data={subsidies}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        mobileTitleKey="paymentDate"
        renderExpandedRow={renderExpandedRow}
        getRowId={(row) => row.id}
        manualSorting
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
      {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
          <Button
            variant="utility"
            icon="arrowBack"
            iconType="outline"
            disabled={!pageInfo?.hasPreviousPage}
            onClick={() =>
              setFilters({
                ...filters,
                cursor: pageInfo?.startCursor ?? undefined,
              })
            }
          >
            {formatMessage(fm.subsidyPrevPage)}
          </Button>
          <Button
            variant="utility"
            icon="arrowForward"
            iconType="outline"
            disabled={!pageInfo?.hasNextPage}
            onClick={() =>
              setFilters({
                ...filters,
                cursor: pageInfo?.endCursor ?? undefined,
              })
            }
          >
            {formatMessage(fm.subsidyNextPage)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Subsidies
