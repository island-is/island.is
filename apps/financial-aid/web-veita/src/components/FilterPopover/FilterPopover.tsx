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
  selectedMonths: number[]
  onFilterClear: () => void
  onFilterSave: () => void
}

const FilterPopover = ({ selectedStates, selectedMonths, onFilterClear, onFilterSave }: Props) => {
  return (
    <Filter
      labelClear=""
      labelClearAll="Hreinsa val"
      labelOpen="Sía niðurstöður"
      variant="popover"
      onFilterClear={onFilterClear}
    >
      <>
        <Box margin={3}>
          <Stack space={1}>
            <Text fontWeight="semiBold" marginBottom={1}>
              Staða
            </Text>
            <Checkbox
              name={getState[ApplicationState.APPROVED]}
              label={getState[ApplicationState.APPROVED]}
              checked={selectedStates.includes(ApplicationState.APPROVED)}
              onChange={(event) => { }}
            />
            <Checkbox
              name={getState[ApplicationState.REJECTED]}
              label={getState[ApplicationState.REJECTED]}
              checked={selectedStates.includes(ApplicationState.REJECTED)}
              onChange={(event) => { }}
            />
          </Stack>

          <Box paddingY={3}>
            <Divider />
          </Box>

          <Stack space={1}>
            <Text fontWeight="semiBold" marginBottom={1}>
              Tímabil
            </Text>
            {months.map((month, i) => (
              <Checkbox
                name={capitalizeFirstLetter(month)}
                label={capitalizeFirstLetter(month)}
                checked={selectedMonths.includes(i)}
                onChange={(event) => { }}
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
            Velja síur
          </Button>
        </Box>
      </>
    </Filter>
  )
}

export default FilterPopover
