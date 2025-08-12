import { FC } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Button, DatePicker, Select } from '@island.is/island-ui/core'

type FiltersPanelProps = {
  districtCourts: { name?: string | null; id?: string | undefined }[]
  institution?: { label: string; value: string }
  fromDate?: Date
  toDate?: Date
  setInstitution: (institution?: { label: string; value: string }) => void
  setFromDate: (date?: Date) => void
  setToDate: (date?: Date) => void
  onClear: () => void
}

export const FiltersPanel: FC<FiltersPanelProps> = ({
  districtCourts,
  institution,
  fromDate,
  toDate,
  setInstitution,
  setFromDate,
  setToDate,
  onClear,
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key="filters"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <Box display="flex" flexDirection="column" rowGap={2}>
        <Select
          name="court"
          label="Veldu dómstól"
          placeholder="Dómstóll"
          size="sm"
          options={districtCourts.map((court) => ({
            label: court.name ?? '',
            value: court.id ?? '',
          }))}
          onChange={(selectedOption) =>
            setInstitution(selectedOption ?? undefined)
          }
          value={institution ?? null}
        />

        <DatePicker
          name="statisticsDateFrom"
          label="Veldu dagsetningu frá"
          placeholderText="Frá"
          size="sm"
          selected={fromDate}
          maxDate={new Date()}
          handleChange={(date: Date | null) => setFromDate(date ?? undefined)}
        />

        <DatePicker
          name="statisticsDateTo"
          label="Veldu dagsetningu til"
          placeholderText="Til"
          size="sm"
          maxDate={new Date()}
          minDate={fromDate}
          selected={toDate}
          handleChange={(date: Date | null) => setToDate(date ?? undefined)}
        />
      </Box>
      <Box display="flex" justifyContent="flexEnd" marginTop={1}>
        <Button
          size="small"
          variant="text"
          colorScheme="destructive"
          onClick={onClear}
        >
          Hreinsa
        </Button>
      </Box>
    </motion.div>
  </AnimatePresence>
)
