import { useCallback, useMemo, useState } from 'react'
import { Column, Row } from 'react-table'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, formatNationalId } from '@island.is/portals/my-pages/core'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'
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
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [orderField, setOrderField] = useState<
    FarmerLandSubsidyOrderField | undefined
  >(undefined)
  const [orderDirection, setOrderDirection] = useState<
    FarmerLandSubsidyOrderDirection | undefined
  >(undefined)

  const { data, loading, error } = useFarmerLandSubsidiesQuery({
    variables: {
      input: {
        farmId,
        cursor,
        contractId,
        paymentCategoryId,
        dateFrom,
        dateTo,
        orderField,
        orderDirection,
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

  const handleSortChange = useCallback(
    (sortBy: Array<{ id: string; desc: boolean }>) => {
      const fieldMap: Partial<Record<string, FarmerLandSubsidyOrderField>> = {
        paymentDate: FarmerLandSubsidyOrderField.PaymentDate,
        contract: FarmerLandSubsidyOrderField.Contract,
      }
      if (sortBy.length === 0) {
        setOrderField(undefined)
        setOrderDirection(undefined)
      } else {
        const field = fieldMap[sortBy[0].id]
        if (field) {
          setOrderField(field)
          setOrderDirection(
            sortBy[0].desc
              ? FarmerLandSubsidyOrderDirection.Descending
              : FarmerLandSubsidyOrderDirection.Ascending,
          )
        }
      }
      setCursor(undefined)
    },
    [],
  )

  const filterCount = [contractId, paymentCategoryId, dateFrom ?? dateTo].filter(
    (v) => v != null,
  ).length

  const columns = useMemo<Column<FarmerLandSubsidy>[]>(
    () => [
      {
        Header: formatMessage(fm.subsidyDate),
        accessor: 'paymentDate',
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString('is-IS') : '',
      },
      {
        Header: formatMessage(fm.subsidyContract),
        accessor: 'contract',
      },
      {
        Header: formatMessage(fm.subsidyGrossAmount),
        accessor: 'grossAmount',
        disableSortBy: true,
        Cell: ({ value }) => formatISK(value),
      },
      {
        Header: formatMessage(fm.subsidyOffset),
        accessor: 'offset',
        disableSortBy: true,
        Cell: ({ value }) => formatISK(value ?? 0),
      },
      {
        Header: formatMessage(fm.subsidyNetPaid),
        accessor: 'netPaid',
        disableSortBy: true,
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
        <SubsidiesFilter
          contractId={contractId}
          paymentCategoryId={paymentCategoryId}
          dateFrom={dateFrom}
          dateTo={dateTo}
          filterCount={filterCount}
          contractItems={contractItems}
          categoryItems={categoryItems}
          onContractChange={(value) => {
            setContractId(value)
            setCursor(undefined)
          }}
          onCategoryChange={(value) => {
            setPaymentCategoryId(value)
            setCursor(undefined)
          }}
          onDateChange={(start, end) => {
            setDateFrom(start)
            setDateTo(end)
            setCursor(undefined)
          }}
          onClear={() => {
            setContractId(undefined)
            setPaymentCategoryId(undefined)
            setDateFrom(undefined)
            setDateTo(undefined)
            setCursor(undefined)
            setOrderField(undefined)
            setOrderDirection(undefined)
          }}
        />
      </Box>
      <FarmerLandsTable
        columns={columns}
        data={subsidies}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        renderExpandedRow={renderExpandedRow}
        getRowId={(row) => row.id}
        manualSort
        onSortChange={handleSortChange}
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
