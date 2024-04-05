import { useEffect, useState } from 'react'
import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Hidden,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'

import { useLocale, useNamespaces } from '@island.is/localization'
import { FootNote, m } from '@island.is/service-portal/core'

import { useGetHousingBenefitsListLazyQuery } from './HousingBenefits.generated'
import HousingBenefitsTable, {
  ITEMS_ON_PAGE,
} from '../../components/HousingBenefitsPayments/HousingBenefitsTable'
import { Problem } from '@island.is/react-spa/shared'
import HousingBenefitsFilter from '../../components/HousingBenefitsPayments/HousingBenefitsFilter'

const FinanceHousingBenefits = () => {
  useNamespaces('sp.finance-housing-benefits')

  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [page, setPage] = useState(1)
  const [paymentOrigin, setPaymentOrigin] = useState<string>()
  const [selectedMonth, setSelectedMonth] = useState<string>()
  const { formatMessage } = useLocale()

  const [loadHousingPayments, { data, loading, error }] =
    useGetHousingBenefitsListLazyQuery()

  const resetFilter = () => {
    setFromDate(undefined)
    setToDate(undefined)
    setPaymentOrigin(undefined)
    setSelectedMonth(undefined)
  }

  useEffect(() => {
    const paymentType = Number(paymentOrigin)
    console.log('paymentType', paymentType)
    loadHousingPayments({
      variables: {
        input: {
          dateFrom: toDate && fromDate ? fromDate.toISOString() : undefined,
          dateTo: toDate && fromDate ? toDate.toISOString() : undefined,
          pageSize: ITEMS_ON_PAGE,
          pageNumber: page,
          month: selectedMonth,
          paymentOrigin: paymentType || undefined,
        },
      },
    })
  }, [toDate, fromDate, page, paymentOrigin, selectedMonth])

  return (
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Hidden print={true}>
          <GridRow rowGap={[1, 1, 2, 2, 'smallGutter']}>
            <GridColumn span={['1/1', '7/9', '6/9', '5/9', '2/9']}>
              <DatePicker
                label={formatMessage(m.datepickerFromLabel)}
                placeholderText={formatMessage(m.datepickLabel)}
                locale="is"
                backgroundColor="blue"
                size="xs"
                handleChange={(d) => setFromDate(d)}
                selected={fromDate}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '7/9', '6/9', '5/9', '2/9']}
              paddingTop={[1, 1, 2, 0, 0]}
            >
              <DatePicker
                label={formatMessage(m.datepickerToLabel)}
                placeholderText={formatMessage(m.datepickLabel)}
                locale="is"
                backgroundColor="blue"
                size="xs"
                handleChange={(d) => setToDate(d)}
                selected={toDate}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '7/9', '6/9', '5/9', '5/9']}
              paddingTop={[3, 3, 2, 2, 3]}
            >
              {!error && (
                <HousingBenefitsFilter
                  payments={data?.housingBenefitsPayments ?? undefined}
                  clearAllFilters={resetFilter}
                  setSelectedMonth={setSelectedMonth}
                  setPaymentOrigin={setPaymentOrigin}
                  selectedMonth={selectedMonth}
                  paymentOrigin={paymentOrigin}
                />
              )}
            </GridColumn>
          </GridRow>
        </Hidden>
        <Box marginTop={3}>
          {!error && !loading && !data?.housingBenefitsPayments && (
            <Problem
              type="no_data"
              title={formatMessage(m.noData)}
              message={formatMessage(m.noTransactionFound)}
              titleSize="h3"
              noBorder={false}
              tag={undefined}
            />
          )}
          {error && !loading && <Problem error={error} noBorder={false} />}
          {loading && !error && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {data?.housingBenefitsPayments?.data &&
            data.housingBenefitsPayments.data.length > 0 && (
              <HousingBenefitsTable
                setPage={setPage}
                page={page}
                payments={data.housingBenefitsPayments}
              />
            )}
        </Box>
      </Stack>
      <FootNote serviceProviderSlug={'hms'} />
    </Box>
  )
}

export default FinanceHousingBenefits
