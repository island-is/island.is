import { useMemo } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  DatePicker,
  Filter,
  GridColumn,
  GridRow,
  Input,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { m } from '@island.is/portals/my-pages/core'
import { olMessage as om } from '../../../../lib/messages'
import * as styles from './SeagoingTime.css'
import { ShipRegistryRank } from '@island.is/api/schema'
import { DEFAULT_PAGE_SIZE, SeaServiceState } from './types'

const pageSizeOptions = [25, 50, 75, 100].map((n) => ({
  label: String(n),
  value: String(n),
}))

interface Props {
  state: SeaServiceState
  patchState: (patch: Partial<SeaServiceState>) => void
  onSearch: (overrides?: Partial<SeaServiceState>) => void
  ranks: ShipRegistryRank[]
  onClear: () => void
}

export const SeagoingTimeFilters = ({
  state,
  patchState,
  onSearch,
  ranks,
  onClear,
}: Props) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isNarrow = width < theme.breakpoints.sm

  const rankOptions = useMemo(
    () => [
      { label: formatMessage(om.sailorSeaServiceRankAll), value: '' },
      ...ranks.map((r) => ({ label: r.name, value: r.id })),
    ],
    [ranks, formatMessage],
  )

  const selectedRank = rankOptions.find((o) => o.value === (state.rankId ?? ''))

  if (isNarrow) {
    return (
      <Box width="full">
        <Filter
          variant="default"
          labelClearAll={formatMessage(om.sailorSeaServiceClearFilters)}
          labelClear={formatMessage(m.clearFilter)}
          labelOpen={formatMessage(m.openFilter)}
          labelTitle={formatMessage(m.filterBy)}
          labelResult={formatMessage(m.showResults)}
          onFilterClear={onClear}
          onFilterResult={() => onSearch({ page: 1 })}
          fluidDisclosure
        >
          <Box paddingX={2} paddingTop={3}>
            <Stack space={3}>
              <Select
                label={formatMessage(om.sailorSeaServiceRank)}
                name="seaServiceRankMobile"
                size="sm"
                options={rankOptions}
                value={selectedRank}
                onChange={(opt) => patchState({ rankId: opt?.value ?? '' })}
                backgroundColor="blue"
              />
              <Select
                label={formatMessage(om.sailorSeaServicePageSize)}
                name="seaServicePageSizeMobile"
                size="sm"
                backgroundColor="blue"
                options={pageSizeOptions}
                value={pageSizeOptions.find(
                  (o) =>
                    o.value === String(state.pageSize ?? DEFAULT_PAGE_SIZE),
                )}
                onChange={(opt) => {
                  const newPageSize = Number(opt?.value ?? DEFAULT_PAGE_SIZE)
                  onSearch({ pageSize: newPageSize, page: 1 })
                }}
              />
              <Accordion dividerOnBottom={false}>
                <AccordionItem
                  id="seaServiceShipSpecs"
                  label={formatMessage(om.sailorSeaServiceShipSpecs)}
                >
                  <Stack space={3}>
                    <Input
                      label={formatMessage(om.sailorSeaServiceMinLength)}
                      placeholder={formatMessage(
                        om.sailorSeaServiceMinLengthPlaceholder,
                      )}
                      name="seaServiceMinLengthMobile"
                      type="number"
                      size="xs"
                      backgroundColor="blue"
                      value={state.length ?? ''}
                      onChange={(e) => patchState({ length: e.target.value })}
                    />
                    <Input
                      label={formatMessage(om.sailorSeaServiceMinPower)}
                      placeholder={formatMessage(
                        om.sailorSeaServiceMinPowerPlaceholder,
                      )}
                      name="seaServiceMinPowerMobile"
                      type="number"
                      size="xs"
                      backgroundColor="blue"
                      value={state.power ?? ''}
                      onChange={(e) => patchState({ power: e.target.value })}
                    />
                    <Input
                      label={formatMessage(om.sailorSeaServiceMinTonnage)}
                      placeholder={formatMessage(
                        om.sailorSeaServiceMinTonnagePlaceholder,
                      )}
                      name="seaServiceMinTonnageMobile"
                      type="number"
                      size="xs"
                      backgroundColor="blue"
                      value={state.tonnage ?? ''}
                      onChange={(e) => patchState({ tonnage: e.target.value })}
                    />
                  </Stack>
                </AccordionItem>
                <AccordionItem
                  id="seaServiceDateRange"
                  label={formatMessage(om.sailorSeaServiceDateRange)}
                >
                  <Stack space={3}>
                    <DatePicker
                      label={formatMessage(om.sailorSeaServiceDateFrom)}
                      placeholderText=""
                      locale="is"
                      size="xs"
                      backgroundColor="blue"
                      selected={state.dateFrom}
                      handleChange={(d) => patchState({ dateFrom: d })}
                    />
                    <DatePicker
                      label={formatMessage(om.sailorSeaServiceDateTo)}
                      placeholderText=""
                      locale="is"
                      size="xs"
                      backgroundColor="blue"
                      selected={state.dateTo}
                      handleChange={(d) => patchState({ dateTo: d })}
                    />
                  </Stack>
                </AccordionItem>
              </Accordion>
            </Stack>
          </Box>
        </Filter>
      </Box>
    )
  }

  return (
    <Stack space={3} dividers={false}>
      <GridRow rowGap={[2, 2, 2, 2, 3]}>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <DatePicker
            label={formatMessage(om.sailorSeaServiceDateFrom)}
            placeholderText=""
            locale="is"
            size="sm"
            backgroundColor="blue"
            selected={state.dateFrom}
            handleChange={(d) => patchState({ dateFrom: d })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <DatePicker
            label={formatMessage(om.sailorSeaServiceDateTo)}
            placeholderText=""
            locale="is"
            size="sm"
            backgroundColor="blue"
            selected={state.dateTo}
            handleChange={(d) => patchState({ dateTo: d })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Select
            label={formatMessage(om.sailorSeaServiceRank)}
            name="seaServiceRank"
            size="sm"
            options={rankOptions}
            value={selectedRank}
            onChange={(opt) => patchState({ rankId: opt?.value ?? '' })}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Input
            label={formatMessage(om.sailorSeaServiceMinLength)}
            placeholder={formatMessage(om.sailorSeaServiceMinLengthPlaceholder)}
            name="seaServiceMinLength"
            size="sm"
            type="number"
            backgroundColor="blue"
            value={state.length ?? ''}
            onChange={(e) => patchState({ length: e.target.value })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Input
            label={formatMessage(om.sailorSeaServiceMinPower)}
            placeholder={formatMessage(om.sailorSeaServiceMinPowerPlaceholder)}
            name="seaServiceMinPower"
            size="sm"
            type="number"
            backgroundColor="blue"
            value={state.power ?? ''}
            onChange={(e) => patchState({ power: e.target.value })}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <Input
            label={formatMessage(om.sailorSeaServiceMinTonnage)}
            placeholder={formatMessage(
              om.sailorSeaServiceMinTonnagePlaceholder,
            )}
            name="seaServiceMinTonnage"
            size="sm"
            type="number"
            backgroundColor="blue"
            value={state.tonnage ?? ''}
            onChange={(e) => patchState({ tonnage: e.target.value })}
          />
        </GridColumn>
      </GridRow>
      <Box display="flex" justifyContent="spaceBetween" alignItems="flexEnd">
        <Box className={styles.searchButton}>
          <Button fluid onClick={() => onSearch({ page: 1 })}>
            {formatMessage(om.sailorSeaServiceSearchButton)}
          </Button>
        </Box>
        <Box className={styles.pageSizeSelect}>
          <Select
            label={formatMessage(om.sailorSeaServicePageSize)}
            name="seaServicePageSize"
            size="sm"
            backgroundColor="blue"
            options={pageSizeOptions}
            value={pageSizeOptions.find(
              (o) => o.value === String(state.pageSize ?? DEFAULT_PAGE_SIZE),
            )}
            onChange={(opt) => {
              const newPageSize = Number(opt?.value ?? DEFAULT_PAGE_SIZE)
              onSearch({ pageSize: newPageSize, page: 1 })
            }}
          />
        </Box>
      </Box>
    </Stack>
  )
}
