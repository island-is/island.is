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

import HousingBenefitsTable from '../../components/HousingBenefitsPayments/HousingBenefitsTable'
import { Problem } from '@island.is/react-spa/shared'
import HousingBenefitsFilter, {
  BASE_YEAR,
} from '../../components/HousingBenefitsPayments/HousingBenefitsFilter'
import { useHousingBenefitsFilters } from './useHousingBenefitsFilters'

const DEFAULT_ITEMS_ON_PAGE = 12
const MAX_ITEMS_ON_PAGE = 75

const FinanceHousingBenefits = () => {
  useNamespaces('sp.finance-housing-benefits')

  const {
    page,
    data,
    loading,
    error,
    fromDate,
    toDate,
    filterValue,
    resetFilter,
    setPaymentOrigin,
    setShowFinalPayments,
    setDates,
    setSelectedMonth,
    setPage,
  } = useHousingBenefitsFilters()

  const { formatMessage } = useLocale()

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
                handleChange={(d) => setDates(d, undefined)}
                selected={fromDate}
                minYear={BASE_YEAR}
                maxYear={new Date().getFullYear()}
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
                handleChange={(d) => setDates(undefined, d)}
                selected={toDate}
                minYear={BASE_YEAR}
                maxYear={new Date().getFullYear()}
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
                  setShowFinalPayments={setShowFinalPayments}
                  paymentOrigin={filterValue?.paymentOrigin ?? undefined}
                  showFinalPayments={!!filterValue?.payments}
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
                itemsOnPage={
                  /^\d+$/.test(filterValue?.month ?? '')
                    ? MAX_ITEMS_ON_PAGE
                    : DEFAULT_ITEMS_ON_PAGE
                }
              />
            )}
        </Box>
      </Stack>
      <FootNote serviceProviderSlug="hms" />
    </Box>
  )
}

export default FinanceHousingBenefits
