import React from 'react'
import {
  Text,
  Box,
  Filter,
  Stack,
  Checkbox,
  Divider,
} from '@island.is/island-ui/core'
import {
  ApplicationState,
  FilterType,
  StaffList,
  getState,
} from '@island.is/financial-aid/shared/lib'
import { Filters } from '@island.is/financial-aid-web/veita/src/utils/useFilter'

interface Props {
  stateOptions: ApplicationState[]
  staffOptions: StaffList[]
  activeFilters: Filters
  onChecked: (
    filter: ApplicationState | string,
    checked: boolean,
    filterType: FilterType,
  ) => void
  onFilterClear: () => void
}

const FilterPopover = ({
  stateOptions,
  staffOptions,
  activeFilters,
  onChecked,
  onFilterClear,
}: Props) => {
  const { applicationState, staff } = activeFilters

  return (
    <Box>
      <Filter
        labelClear=""
        labelClearAll="Hreinsa val"
        labelOpen="Sía"
        variant="popover"
        onFilterClear={onFilterClear}
      >
        <>
          <Box margin={3} marginBottom={3}>
            <Stack space={1}>
              <Text fontWeight="semiBold" marginBottom={1}>
                Staða
              </Text>
              {stateOptions.map((state) => (
                <Checkbox
                  name={getState[state]}
                  label={getState[state]}
                  key={`state-${state}`}
                  checked={applicationState.includes(state)}
                  onChange={(event) =>
                    onChecked(
                      state,
                      event.target.checked,
                      FilterType.APPLICATIONSTATE,
                    )
                  }
                />
              ))}
            </Stack>

            <Box paddingY={3}>
              <Divider />
            </Box>

            <Stack space={1}>
              <Text fontWeight="semiBold" marginBottom={1}>
                Starfsmenn
              </Text>
              {staffOptions.map((staffMember) => (
                <Checkbox
                  name={staffMember.name}
                  label={staffMember.name}
                  key={`state-${staffMember.nationalId}`}
                  checked={staff.includes(staffMember.nationalId)}
                  onChange={(event) =>
                    onChecked(
                      staffMember.nationalId,
                      event.target.checked,
                      FilterType.STAFF,
                    )
                  }
                />
              ))}
            </Stack>
          </Box>
        </>
      </Filter>
    </Box>
  )
}

export default FilterPopover
