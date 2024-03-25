import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {
  Box,
  Button,
  DatePicker,
  GridColumn,
  GridRow,
  Hidden,
  Inline,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { FootNote, m } from '@island.is/service-portal/core'

import { useGetHousingBenefitsListQuery } from './HousingBenefits.generated'
import HousingBenefitsTable from '../../components/HousingBenefitPayments/HousingBenefitsTable'
import { Problem } from '@island.is/react-spa/shared'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import { exportHousingBenefitFiles } from '../../utils/filesHousingBenefits'

export const ITEMS_ON_PAGE = 10

const FinanceHousingBenefits = () => {
  useNamespaces('sp.finance-housing-benefits')

  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const { formatMessage } = useLocale()
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (toDate && fromDate) {
      loadMore('', true)
    }
  }, [toDate, fromDate])

  const { data, loading, error, fetchMore } = useGetHousingBenefitsListQuery({
    variables: {
      input: {
        limit: ITEMS_ON_PAGE,
        before: '',
        after: '',
      },
    },
  })

  const loadMore = (cursor: string, restart = false) => {
    if (loadingMore || !data || error) return
    setLoadingMore(true)
    fetchMore({
      variables: {
        input: {
          dateFrom: fromDate ? fromDate.toISOString() : undefined,
          dateTo: toDate ? toDate.toISOString() : undefined,
          limit: ITEMS_ON_PAGE,
          ...(cursor && { after: cursor }),
        },
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (
          fetchMoreResult?.housingBenefitPayments?.data.length &&
          prevResult?.housingBenefitPayments?.data.length
        ) {
          if (restart) {
            fetchMoreResult.housingBenefitPayments.data = [
              ...fetchMoreResult.housingBenefitPayments.data,
            ]
          } else {
            fetchMoreResult.housingBenefitPayments.data = [
              ...prevResult.housingBenefitPayments.data,
              ...fetchMoreResult.housingBenefitPayments.data,
            ]
          }
          return fetchMoreResult
        }
        return prevResult
      },
    }).finally(() => setLoadingMore(false))
  }

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
              paddingTop={[1, 1, 2, 0, 0]}
            >
              {data?.housingBenefitPayments?.data &&
                data.housingBenefitPayments.data.length > 0 && (
                  <Box display="flex" height="full" alignItems="flexEnd">
                    <Inline space={2}>
                      <Button
                        colorScheme="default"
                        icon="print"
                        iconType="filled"
                        onClick={() => window.print()}
                        preTextIconType="filled"
                        size="default"
                        type="button"
                        variant="utility"
                      >
                        {formatMessage(m.print)}
                      </Button>
                      <DropdownExport
                        onGetCSV={() =>
                          exportHousingBenefitFiles(
                            data.housingBenefitPayments?.data ?? [],
                            'csv',
                          )
                        }
                        onGetExcel={() =>
                          exportHousingBenefitFiles(
                            data.housingBenefitPayments?.data ?? [],
                            'xlsx',
                          )
                        }
                      />
                    </Inline>
                  </Box>
                )}
            </GridColumn>
          </GridRow>
        </Hidden>
        <Box marginTop={3}>
          {error && !loading && <Problem error={error} noBorder={false} />}
          {loading && !error && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {/* {data?.housingBenefitPayments?.data &&
            data.housingBenefitPayments.data.length > 0 && (
              <>
                <HousingBenefitsTable payments={data.housingBenefitPayments} />
                {loadingMore && (
                  <Box paddingTop={1}>
                    <SkeletonLoader space={1} height={40} repeat={2} />
                  </Box>
                )}
                {data?.housingBenefitPayments?.pageInfo.hasNextPage ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    marginTop={4}
                    justifyContent="center"
                  >
                    <Button
                      onClick={() =>
                        loadMore(
                          data?.housingBenefitPayments?.pageInfo.endCursor ??
                            '',
                        )
                      }
                      variant="ghost"
                      size="small"
                    >
                      {`${formatMessage(m.fetchMore)} ${
                        data?.housingBenefitPayments?.data?.length ?? 0
                      }/${data?.housingBenefitPayments?.totalCount ?? 1}`}
                    </Button>
                  </Box>
                ) : undefined}
              </>
            )} */}

          {data?.housingBenefitPayments?.data &&
            data.housingBenefitPayments.data.length > 0 && (
              <>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={() =>
                    loadMore(
                      data?.housingBenefitPayments?.pageInfo.endCursor ?? '',
                    )
                  }
                  hasMore={
                    !loadingMore &&
                    data?.housingBenefitPayments.pageInfo.hasNextPage
                  }
                >
                  <HousingBenefitsTable
                    payments={data.housingBenefitPayments}
                  />
                </InfiniteScroll>
                {loadingMore && (
                  <Box paddingTop={2}>
                    <SkeletonLoader space={1} height={40} repeat={4} />
                  </Box>
                )}
              </>
            )}
        </Box>
      </Stack>
      <FootNote serviceProviderSlug={'hms'} />
    </Box>
  )
}

export default FinanceHousingBenefits
