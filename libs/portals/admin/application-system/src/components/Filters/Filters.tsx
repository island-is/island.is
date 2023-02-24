import {
  Box,
  Text,
  FilterMultiChoice,
  Filter,
  FilterInput,
  Hidden,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { DatePickerController } from '@island.is/shared/form-fields'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import { ApplicationFilters } from '../../screens/ExampleScreen/example'

interface Props {
  onFilterChange: (data: ApplicationFilters) => void
  onFilterClear: () => void
  numberOfDocuments?: number
}

export const Filters = ({
  onFilterChange,
  onFilterClear,
  numberOfDocuments,
}: Props) => {
  const { formatMessage } = useLocale()
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
  })

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        onSubmit={form.handleSubmit(onFilterChange)}
        marginBottom={4}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
          flexDirection={['column', 'column', 'column', 'row']}
        >
          <Filter
            variant={isMobile ? 'dialog' : 'popover'}
            align="left"
            reverse
            labelClear={formatMessage(m.clearFilter)}
            labelClearAll={formatMessage(m.clearAllFilters)}
            labelOpen={formatMessage(m.openFilter)}
            labelClose={formatMessage(m.closeFilter)}
            resultCount={numberOfDocuments}
            labelResult="hello"
            labelTitle="hello"
            filterInput={
              <Box display="flex" flexDirection={['column', 'column', 'row']}>
                <FilterInput
                  placeholder={formatMessage(m.searchPlaceholder)}
                  name="finance-transaction-input"
                  value={'0101307789'}
                  onChange={(e) => null}
                  backgroundColor="blue"
                />
                <Box marginX={[0, 0, 2]} marginY={[2, 2, 0]}>
                  <DatePickerController
                    id="period.from"
                    label=""
                    backgroundColor="blue"
                    placeholder={formatMessage(m.filterFrom)}
                    size="xs"
                  />
                </Box>
                <DatePickerController
                  id="period.to"
                  label=""
                  backgroundColor="blue"
                  placeholder={formatMessage(m.filterTo)}
                  size="xs"
                />
              </Box>
            }
            onFilterClear={onFilterClear}
          >
            <FilterMultiChoice
              labelClear={formatMessage(m.clearSelected)}
              singleExpand={true}
              onChange={({ selected }) => null}
              onClear={() => null}
              categories={[
                {
                  id: 'institutions',
                  label: 'Stofnun',
                  selected: ['vinnumalastofnun'],
                  filters: [
                    { label: 'Vinnumálastofnun', value: 'vinnumalastofnun' },
                    { label: 'Vegagerðin', value: 'vegagerdin' },
                    { label: 'Persónuvernd', value: 'Persónuvernd' },
                  ],
                  inline: false,
                  singleOption: false,
                },
                {
                  id: 'application',
                  label: 'Umsókn',
                  selected: [],
                  filters: [{ label: 'Hello', value: 'hello' }],
                },
                {
                  id: 'status',
                  label: 'Staða',
                  selected: [],
                  filters: [{ label: 'Hello', value: 'hello' }],
                },
              ]}
            />
          </Filter>

          {numberOfDocuments !== undefined && (
            <Hidden below="md">
              <Text variant="small" fontWeight="semiBold" whiteSpace="nowrap">
                {formatMessage(m.resultCount, { count: numberOfDocuments })}
              </Text>
            </Hidden>
          )}
        </Box>
      </Box>
    </FormProvider>
  )
}
