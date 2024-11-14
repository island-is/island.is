import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Checkbox,
  FilterMultiChoice,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { HousingBenefitsPayments } from '@island.is/api/schema'
import { m, Filter, MONTHS } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { exportHousingBenefitFiles } from '../../utils/filesHousingBenefits'
import {
  generateMonthArray,
  generateYearArray,
} from '../../utils/generateMonthArray'
import { m as messages } from '../../lib/messages'
import cn from 'classnames'
import * as styles from './HousingBenefits.css'
import * as financeStyles from '../../screens/Finance.css'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import { DEFAULT_PAYMENT_ORIGIN } from '../../screens/HousingBenefits/useHousingBenefitsFilters'

export const BASE_YEAR = 2017

export type DateSelection = {
  label?: string
  value?: string
}

interface Props {
  payments?: HousingBenefitsPayments
  paymentOrigin?: number
  showFinalPayments: boolean
  clearAllFilters: () => void
  setPaymentOrigin: (po: string) => void
  setSelectedMonth: (sm?: string) => void
  setShowFinalPayments: (p: boolean) => void
}
const HousingBenefitsFilter = ({
  payments,
  paymentOrigin,
  showFinalPayments,
  clearAllFilters,
  setSelectedMonth,
  setPaymentOrigin,
  setShowFinalPayments,
}: Props) => {
  const { formatMessage } = useLocale()
  const [currentMonth, setCurrentMonth] = useState<DateSelection>()
  const [currentYear, setCurrentYear] = useState<DateSelection>()

  const monthOptions = useMemo(
    () =>
      generateMonthArray(
        MONTHS.map((month) => formatMessage(m[month as keyof typeof m])),
      ),
    [formatMessage],
  )
  const yearOptions = useMemo(() => generateYearArray(BASE_YEAR), [])

  useEffect(() => {
    if (currentYear?.value) {
      setSelectedMonth(
        `${currentYear.value}${
          currentMonth?.value ? `-${currentMonth.value}` : ''
        }`,
      )
    }
    if (!currentYear?.value && !currentMonth?.value) {
      setSelectedMonth(undefined)
    }
  }, [currentYear, currentMonth])

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
      <Box>
        <FilterMultiChoice
          labelClear={formatMessage(m.clearSelected)}
          singleExpand={true}
          onChange={({ selected, categoryId }) => {
            if (categoryId === 'payment-type') {
              setPaymentOrigin(selected[0])
            }
          }}
          onClear={(categoryId) => {
            if (categoryId === 'payment-type') {
              setPaymentOrigin(DEFAULT_PAYMENT_ORIGIN)
            }
          }}
          categories={[
            {
              id: 'payment-type',
              label: formatMessage(messages.hbPaymentType),
              selected:
                typeof paymentOrigin === 'number'
                  ? [String(paymentOrigin)]
                  : [],
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
          ]}
        />
      </Box>
      <Box className={financeStyles.dateFilter} paddingX={3}>
        <Box borderBottomWidth="standard" borderColor="blue200" width="full" />
        <Box marginTop={1}>
          <Accordion
            dividerOnBottom={false}
            dividerOnTop={false}
            singleExpand={false}
          >
            <AccordionItem
              key="date-accordion-item"
              id="date-accordion-item"
              label={formatMessage(messages.hbRentalMonthYear)}
              labelColor="dark400"
              labelUse="h5"
              labelVariant="h5"
              iconVariant="small"
            >
              <Box
                className={cn(financeStyles.accordionBox, styles.selectBox)}
                display="flex"
                flexDirection="column"
              >
                <Stack space="smallGutter">
                  <Select
                    label={formatMessage(m.month)}
                    placeholder={formatMessage(m.month)}
                    name="month"
                    onChange={(opt) =>
                      setCurrentMonth({
                        ...opt,
                      })
                    }
                    options={monthOptions}
                    isClearable
                    size="sm"
                  />
                  <Select
                    label={formatMessage(m.year)}
                    placeholder={formatMessage(m.year)}
                    name="year"
                    onChange={(opt) =>
                      setCurrentYear({
                        ...opt,
                      })
                    }
                    options={yearOptions}
                    isClearable
                    size="sm"
                  />
                </Stack>
              </Box>
            </AccordionItem>
          </Accordion>
          <Box
            borderBottomWidth="standard"
            borderColor="blue200"
            width="full"
            marginTop={1}
            marginBottom={1}
          />
          <Box paddingY={2}>
            <Checkbox
              label={formatMessage(messages.onlyShowPayments)}
              onChange={(e) => setShowFinalPayments(e.target.checked)}
              checked={showFinalPayments}
            />
          </Box>
        </Box>
      </Box>
    </Filter>
  )
}

export default HousingBenefitsFilter
