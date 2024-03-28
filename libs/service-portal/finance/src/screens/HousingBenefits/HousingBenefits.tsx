import { useEffect, useState } from 'react'
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

import { useGetHousingBenefitsListLazyQuery } from './HousingBenefits.generated'
import HousingBenefitsTable, {
  ITEMS_ON_PAGE,
} from '../../components/HousingBenefitPayments/HousingBenefitsTable'
import { Problem } from '@island.is/react-spa/shared'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import { exportHousingBenefitFiles } from '../../utils/filesHousingBenefits'

const FinanceHousingBenefits = () => {
  useNamespaces('sp.finance-housing-benefits')

  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const [loadHousingPayments, { data, loading, error }] =
    useGetHousingBenefitsListLazyQuery()

  const resetCal = () => {
    setFromDate(undefined)
    setToDate(undefined)
  }

  useEffect(() => {
    loadHousingPayments({
      variables: {
        input: {
          dateFrom: toDate && fromDate ? fromDate.toISOString() : undefined,
          dateTo: toDate && fromDate ? toDate.toISOString() : undefined,
          pageSize: ITEMS_ON_PAGE,
          pageNumber: page,
        },
      },
    })
  }, [toDate, fromDate, page])

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
                        dropdownItems={[
                          {
                            title: formatMessage(m.clearFilter),
                            onClick: () => resetCal(),
                          },
                        ]}
                      />
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
                    </Inline>
                  </Box>
                )}
            </GridColumn>
          </GridRow>
        </Hidden>
        <Box marginTop={3}>
          {!error && !loading && !data?.housingBenefitPayments && (
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
          {data?.housingBenefitPayments?.data &&
            data.housingBenefitPayments.data.length > 0 && (
              <HousingBenefitsTable
                setPage={setPage}
                page={page}
                payments={data.housingBenefitPayments}
              />
            )}
        </Box>
      </Stack>
      <FootNote serviceProviderSlug={'hms'} />
    </Box>
  )
}

export default FinanceHousingBenefits
