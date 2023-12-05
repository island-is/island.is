import React from 'react'
import {
  Text,
  Box,
  Button,
  Filter,
  Stack,
  Checkbox,
  Divider,
} from '@island.is/island-ui/core'
import {
  ApplicationState,
  capitalizeFirstLetter,
  getState,
  months,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  selectedStates: ApplicationState[]
  selectedStaff: string[]
  results: number
  onChecked: (item: ApplicationState | number, checked: boolean) => void
  onFilterClear: () => void
  onFilterSave: () => void
  staffOptions: string[]
  stateOptions?: ApplicationState[]
}

const FilterPopover = ({
  stateOptions,
  selectedStates,
  selectedStaff,
  results,
  onChecked,
  onFilterClear,
  onFilterSave,
  staffOptions,
}: Props) => {
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
            <Box margin={3} marginBottom={0}>
              <Stack space={1}>
                <Text fontWeight="semiBold" marginBottom={1}>
                  Staða
                </Text>
                {stateOptions &&
                  stateOptions.map((state) => (
                    <Checkbox
                      name={getState[state]}
                      label={getState[state]}
                      checked={selectedStates.includes(state)}
                      onChange={(event) =>
                        onChecked(state, event.target.checked)
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
                {selectedStaff.map((staff) => (
                  <Checkbox
                    name={staff}
                    label={staff}
                    checked={false}
                    onChange={(event) => console.log('helo')}
                  />
                ))}
              </Stack>
            </Box>

            <Box
              display="flex"
              width="full"
              paddingX={3}
              paddingY={2}
              justifyContent="center"
              border="standard"
              borderColor="blue400"
            >
              <Button
                icon="checkmark"
                size="small"
                variant="text"
                onClick={onFilterSave}
              >
                Uppfæra lista með síum
              </Button>
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
