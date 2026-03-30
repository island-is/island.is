import { useMemo, useState } from 'react'
import { Column, Row } from 'react-table'
import {
  Box,
  Button,
  Filter,
  FilterMultiChoice,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, formatNationalId } from '@island.is/portals/my-pages/core'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'
import { farmerLandsMessages as fm } from '../../../../lib/messages'
import { FarmerLandSubsidy } from '@island.is/api/schema'
import { useFarmerLandSubsidiesQuery } from './FarmerLandSubsidies.generated'

interface Props {
  farmId: string
}

const formatISK = (value?: number | null): string => {
  if (value == null) return ''

  const formattedValue = new Intl.NumberFormat('is-IS').format(value)
  return `${formattedValue} kr.`
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

export const Subsidies = ({ farmId }: Props) => {
  const { formatMessage } = useLocale()
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [contractId, setContractId] = useState<string | undefined>(undefined)
  const [paymentCategoryId, setPaymentCategoryId] = useState<
    number | undefined
  >(undefined)

  const { data, loading, error } = useFarmerLandSubsidiesQuery({
    variables: {
      input: {
        farmId,
        after: cursor,
        contractId,
        paymentCategoryId,
      },
    },
  })

  const pageInfo = data?.farmerLandSubsidies?.pageInfo
  const subsidies = useMemo(() => data?.farmerLandSubsidies?.data ?? [], [data])
  const filterOptions = data?.farmerLandSubsidies?.filterOptions

  const contractItems = useMemo(
    () =>
      (filterOptions?.contracts ?? []).map((c) => ({
        value: c.contractId,
        label: c.contractName,
      })),
    [filterOptions?.contracts],
  )

  const categoryItems = useMemo(
    () =>
      (filterOptions?.paymentCategories ?? []).map((pc) => ({
        value: String(pc.paymentCategoryId),
        label: pc.paymentCategoryName,
      })),
    [filterOptions?.paymentCategories],
  )

  const filterCount = [contractId, paymentCategoryId].filter(
    (v) => v != null,
  ).length

  const clearFilters = () => {
    setContractId(undefined)
    setPaymentCategoryId(undefined)
    setCursor(undefined)
  }

  const columns = useMemo<Column<FarmerLandSubsidy>[]>(
    () => [
      {
        Header: formatMessage(fm.subsidyDate),
        accessor: 'paymentDate',
        sortType: 'basic',
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString('is-IS') : '',
      },
      {
        Header: formatMessage(fm.subsidyContract),
        accessor: 'contract',
        sortType: 'basic',
      },
      {
        Header: formatMessage(fm.subsidyGrossAmount),
        accessor: 'grossAmount',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatISK(value),
      },
      {
        Header: formatMessage(fm.subsidyOffset),
        accessor: 'offset',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatISK(value ?? 0),
      },
      {
        Header: formatMessage(fm.subsidyNetPaid),
        accessor: 'netPaid',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatISK(value),
      },
    ],
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<FarmerLandSubsidy>) => (
    <>
      <DetailRow>
        <DetailCell label white>
          {formatMessage(fm.subsidyName)}
        </DetailCell>
        <DetailCell white>{row.original.name}</DetailCell>
        <DetailCell label white gap>
          {formatMessage(fm.subsidyNationalId)}
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
        <DetailCell>{formatISK(row.original.unitPrice)}</DetailCell>
      </DetailRow>
      <DetailRow>
        <DetailCell label white>
          {formatMessage(fm.subsidyCategory)}
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
        <Filter
          variant="popover"
          align="left"
          reverse
          labelOpen={formatMessage(m.openFilter)}
          labelClose={formatMessage(m.closeFilter)}
          labelClear={formatMessage(m.clearFilter)}
          labelClearAll={formatMessage(m.clearAllFilters)}
          filterCount={filterCount}
          onFilterClear={clearFilters}
        >
          <FilterMultiChoice
            labelClear={formatMessage(m.clearSelected)}
            singleExpand
            onChange={({ categoryId, selected }) => {
              if (categoryId === 'contract')
                setContractId(selected[0] ?? undefined)
              if (categoryId === 'category')
                setPaymentCategoryId(
                  selected[0] ? Number(selected[0]) : undefined,
                )
              setCursor(undefined)
            }}
            onClear={(categoryId) => {
              if (categoryId === 'contract') setContractId(undefined)
              if (categoryId === 'category') setPaymentCategoryId(undefined)
              setCursor(undefined)
            }}
            categories={[
              {
                id: 'contract',
                label: formatMessage(fm.subsidyContract),
                selected: contractId ? [contractId] : [],
                filters: contractItems,
                singleOption: true,
                searchPlaceholder: formatMessage(m.searchPlaceholder),
              },
              {
                id: 'category',
                label: formatMessage(fm.subsidyCategory),
                selected:
                  paymentCategoryId != null ? [String(paymentCategoryId)] : [],
                filters: categoryItems,
                singleOption: true,
                searchPlaceholder: formatMessage(m.searchPlaceholder),
              },
            ]}
          />
        </Filter>
      </Box>
      <FarmerLandsTable
        columns={columns}
        data={subsidies}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        renderExpandedRow={renderExpandedRow}
        getRowId={(row) => row.id}
      />
      {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
        <Box display="flex" justifyContent="spaceBetween" marginTop={3}>
          <Button
            variant="utility"
            icon="arrowBack"
            iconType="outline"
            disabled={!pageInfo?.hasPreviousPage}
            onClick={() => setCursor(pageInfo?.startCursor ?? undefined)}
          >
            {formatMessage(fm.subsidyPrevPage)}
          </Button>
          <Button
            variant="utility"
            icon="arrowForward"
            iconType="outline"
            disabled={!pageInfo?.hasNextPage}
            onClick={() => setCursor(pageInfo?.endCursor ?? undefined)}
          >
            {formatMessage(fm.subsidyNextPage)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Subsidies
