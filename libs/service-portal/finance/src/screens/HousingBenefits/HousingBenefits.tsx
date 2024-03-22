import { useEffect, useState } from 'react'
import {
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Hidden,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { FootNote, m } from '@island.is/service-portal/core'

import { useGetHousingBenefitsListLazyQuery } from './HousingBenefits.generated'
import HousingBenefitsTable, {
  ITEMS_ON_PAGE,
} from '../../components/HousingBenefitPayments/HousingBenefitsTable'

const DEFAULT_FROM_DATE = new Date('2017-7-13 14:5:24')
const DEFAULT_TO_DATE = new Date('2024-12-13 14:5:24')

const FinanceHousingBenefits = () => {
  useNamespaces('sp.finance-housing-benefits')

  const [fromDate, setFromDate] = useState<Date>(DEFAULT_FROM_DATE)
  const [toDate, setToDate] = useState<Date>(DEFAULT_TO_DATE)
  const { formatMessage } = useLocale()

  const [loadHousingPayments, { data, loading, called, error }] =
    useGetHousingBenefitsListLazyQuery()

  useEffect(() => {
    if (toDate && fromDate) {
      loadHousingPayments({
        variables: {
          input: {
            dateFrom: fromDate.toISOString(),
            dateTo: toDate.toISOString(),
            limit: ITEMS_ON_PAGE,
          },
        },
      })
    }
  }, [toDate, fromDate])

  function clearAllFilters() {
    setFromDate(new Date())
    setToDate(new Date())
  }

  const totalPages = 1

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
          </GridRow>
        </Hidden>
        <Box marginTop={3}>
          {data?.housingBenefitPayments && (
            <HousingBenefitsTable payments={data.housingBenefitPayments} />
          )}
        </Box>
      </Stack>
      <FootNote serviceProviderSlug={'hms'} />
    </Box>
  )
}

export default FinanceHousingBenefits
