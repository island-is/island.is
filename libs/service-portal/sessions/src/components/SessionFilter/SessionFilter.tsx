import {
  Accordion,
  AccordionItem,
  Box,
  DatePicker,
  Filter,
  FilterInput,
  Stack,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import * as styles from './SessionFilter.css'
import cn from 'classnames'
import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import addYears from 'date-fns/addYears'

const defaultCalState = { top: false, lower: false }

interface IProps {
  onNationalIdFilterChange: (value: string) => void
  nationalId: string
  fromDate?: Date
  toDate?: Date
  handleDateChange: (date: Date, type: 'from' | 'to' | 'clear') => void
  resultCount: number
}

const SessionFilter: React.FC<IProps> = ({
  onNationalIdFilterChange,
  nationalId,
  handleDateChange,
  toDate,
  fromDate,
  resultCount,
}) => {
  const { formatMessage } = useLocale()
  const { lg } = useBreakpoint()

  const [openCal, setOpenCal] = useState<{ top: boolean; lower: boolean }>(
    defaultCalState,
  )

  return (
    <Box marginTop={'containerGutter'}>
      <Filter
        variant={lg ? 'popover' : 'dialog'}
        align="left"
        reverse
        labelClear={formatMessage(m.clearFilter)}
        labelClearAll={formatMessage(m.clearAllFilters)}
        labelOpen={formatMessage(m.openFilter)}
        labelClose={formatMessage(m.closeFilter)}
        resultCount={resultCount}
        filterInput={
          <FilterInput
            placeholder={formatMessage(m.searchByNationalId)}
            name="session-nationalId-input"
            value={nationalId}
            onChange={onNationalIdFilterChange}
            backgroundColor="blue"
          />
        }
        onFilterClear={() => {
          handleDateChange(new Date(), 'clear')
        }}
      >
        <Box className={styles.dateFilter} paddingX={3}>
          <Box
            borderBottomWidth="standard"
            borderColor="blue200"
            width="full"
          />
          <Box marginTop={5}>
            <Accordion
              dividerOnBottom={false}
              dividerOnTop={false}
              singleExpand={false}
            >
              <AccordionItem
                key="date-accordion-item"
                id="date-accordion-item"
                label={formatMessage(m.datesLabel)}
                labelUse="h5"
                labelColor="blue400"
                labelVariant="h5"
                iconVariant="small"
              >
                <Box
                  className={cn({
                    [styles.openCal]: openCal?.top,
                    [styles.openLowerCal]: openCal?.lower,
                  })}
                  display="flex"
                  flexDirection="column"
                >
                  <Stack space={3}>
                    <h1>test</h1>
                    <DatePicker
                      id="date-from"
                      label={formatMessage(m.datepickerFromLabel)}
                      placeholderText={formatMessage(m.datepickLabel)}
                      locale="is"
                      backgroundColor="blue"
                      size="xs"
                      handleChange={(d) => handleDateChange(d, 'from')}
                      handleOpenCalendar={() =>
                        setOpenCal({ top: true, lower: false })
                      }
                      minDate={addYears(new Date(), -1)}
                      maxDate={new Date()}
                      handleCloseCalendar={() => setOpenCal(defaultCalState)}
                      selected={fromDate}
                    />
                    <DatePicker
                      id="date-to"
                      label={formatMessage(m.datepickerToLabel)}
                      placeholderText={formatMessage(m.datepickLabel)}
                      locale="is"
                      backgroundColor="blue"
                      size="xs"
                      handleChange={(d) => handleDateChange(d, 'to')}
                      handleOpenCalendar={() =>
                        setOpenCal({ top: false, lower: true })
                      }
                      maxDate={new Date()}
                      minDate={addYears(new Date(), -1)}
                      handleCloseCalendar={() => setOpenCal(defaultCalState)}
                      selected={toDate}
                    />
                  </Stack>
                </Box>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
      </Filter>
    </Box>
  )
}

export default SessionFilter
