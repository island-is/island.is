import { useMemo } from 'react'
import { Box, Button, FilterMultiChoice } from '@island.is/island-ui/core'
import { HousingBenefitsPayments } from '@island.is/api/schema'
import { m, Filter } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { exportHousingBenefitFiles } from '../../utils/filesHousingBenefits'
import generateYearMonthArray from '../../utils/generateMonthArray'
import { m as messages } from '../../lib/messages'
import * as styles from './HousingBenefits.css'
import DropdownExport from '../../components/DropdownExport/DropdownExport'

interface Props {
  payments?: HousingBenefitsPayments
  paymentOrigin?: string
  selectedMonth?: string
  clearAllFilters: () => void
  setSelectedMonth: (sm?: string) => void
  setPaymentOrigin: (po?: string) => void
}
const HousingBenefitsFilter = ({
  payments,
  paymentOrigin,
  selectedMonth,
  clearAllFilters,
  setSelectedMonth,
  setPaymentOrigin,
}: Props) => {
  const { formatMessage } = useLocale()

  const yearMonthOptions = useMemo(generateYearMonthArray, [])

  return (
    <Filter
      variant="popover"
      align="left"
      reverse
      labelClear={formatMessage(m.clearFilter)}
      labelClearAll={formatMessage(m.clearAllFilters)}
      labelOpen={formatMessage(m.openFilter)}
      labelClose={formatMessage(m.closeFilter)}
      additionalFilters={
        <>
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
              exportHousingBenefitFiles(payments?.data ?? [], 'csv')
            }
            onGetExcel={() =>
              exportHousingBenefitFiles(payments?.data ?? [], 'xlsx')
            }
          />
        </>
      }
      onFilterClear={clearAllFilters}
    >
      <Box className={styles.selectBox}>
        <FilterMultiChoice
          labelClear={formatMessage(m.clearSelected)}
          singleExpand={true}
          onChange={({ selected, categoryId }) => {
            if (categoryId === 'payment-type') {
              setPaymentOrigin(selected[0])
            }
            if (categoryId === 'rental-month-year') {
              setSelectedMonth(selected[0])
            }
          }}
          onClear={(categoryId) => {
            if (categoryId === 'payment-type') {
              setPaymentOrigin(undefined)
            }
            if (categoryId === 'rental-month-year') {
              setSelectedMonth(undefined)
            }
          }}
          categories={[
            {
              id: 'payment-type',
              label: formatMessage(messages.hbPaymentType),
              selected: paymentOrigin ? [paymentOrigin] : [],
              filters: [
                {
                  value: '0',
                  label: formatMessage(messages.hbAllPayments),
                },
                {
                  value: '1',
                  label: formatMessage(messages.hbGeneralPayments),
                },
                {
                  value: '2',
                  label: formatMessage(messages.hbSpecialPayments),
                },
              ],
              inline: false,
              singleOption: true,
            },
            {
              id: 'rental-month-year',
              label: formatMessage(messages.hbRentalMonthYear),
              selected: selectedMonth ? [selectedMonth] : [],
              filters: yearMonthOptions,
              inline: false,
              singleOption: true,
            },
          ]}
        />
      </Box>
    </Filter>
  )
}

export default HousingBenefitsFilter
