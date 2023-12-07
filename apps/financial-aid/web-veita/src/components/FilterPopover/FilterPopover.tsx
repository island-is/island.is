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
import { Filters } from '../../utils/useFilter'

interface Props {
  stateOptions: ApplicationState[]
  staffOptions: StaffList[]
  activeFilters: Filters
  onChecked: (
    filter: ApplicationState | string,
    checked: boolean,
    filterType: FilterType,
  ) => void
  results: number
  onFilterClear: () => void
}

const FilterPopover = ({
  stateOptions,
  staffOptions,
  activeFilters,
  onChecked,
  onFilterClear,
  results,
}: Props) => {
  const { applicationState, staff } = activeFilters

  return (
    <Box
      display="flex"
      width="half"
      justifyContent="flexStart"
      alignItems="center"
    >
      <Box marginRight={3}>
        <Filter
          labelClear=""
          labelClearAll="Hreinsa val"
          labelOpen="Sía niðurstöður"
          variant="popover"
          onFilterClear={onFilterClear}
        >
          <>
            <Box margin={3} marginBottom={3}>
              <Stack space={1}>
                <Text fontWeight="semiBold" marginBottom={1}>
                  Staða
                </Text>
                {stateOptions.map((state) => {
                  const stateName = getState[state]
                  return (
                    <Checkbox
                      name={stateName}
                      label={stateName}
                      checked={applicationState.includes(state)}
                      onChange={(event) =>
                        onChecked(
                          state,
                          event.target.checked,
                          FilterType.APPLICATIONSTATE,
                        )
                      }
                    />
                  )
                })}
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

      <Text fontWeight="semiBold" whiteSpace="nowrap">
        {`${results} ${results === 1 ? 'niðurstaða' : 'niðurstöður'}`}
      </Text>
    </Box>
  )
}

export default FilterPopover
