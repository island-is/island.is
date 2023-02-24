import {
  Box,
  Text,
  FilterMultiChoice,
  Filter,
  FilterInput,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController } from '@island.is/shared/form-fields'
import { FormProvider, useForm } from 'react-hook-form'
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
  const form = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
  })

  return (
    <FormProvider {...form}>
      <Box
        component="form"
        onSubmit={form.handleSubmit(onFilterChange)}
        marginBottom={4}
      >
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Box flexShrink={1}>
            <Filter
              variant="popover"
              align="left"
              reverse
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              filterInput={
                <Box display="flex">
                  <FilterInput
                    placeholder={formatMessage(m.searchPlaceholder)}
                    name="finance-transaction-input"
                    value={'0101307789'}
                    onChange={(e) => null}
                    backgroundColor="blue"
                  />
                  <Box marginX={2}>
                    <DatePickerController
                      id="period.from"
                      label=""
                      backgroundColor="blue"
                      placeholder="Frá"
                      size="xs"
                    />
                  </Box>
                  <DatePickerController
                    id="period.to"
                    label=""
                    backgroundColor="blue"
                    placeholder="To"
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
          </Box>

          {numberOfDocuments !== undefined && (
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(m.resultCount, { count: numberOfDocuments })}
            </Text>
          )}
        </Box>
      </Box>
    </FormProvider>
  )
}
