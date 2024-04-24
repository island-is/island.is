import { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import SelectNavComponent from './components/SelectNavComponent'
import ControlContext from '../../context/ControlContext'
import {
  FormSystemGroup,
  FormSystemInput,
  FormSystemStep,
} from '@island.is/api/schema'
import { NavbarSelectStatus } from '../../lib/utils/interfaces'

export default function NavbarSelect() {
  const { control, selectStatus } = useContext(ControlContext)
  const { activeItem, form } = control
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form
  let selectable = false
  return (
    <Box>
      <Box paddingBottom={2} overflow="hidden">
        <Text variant="h5">Skref</Text>
      </Box>
      {steps
        ?.filter((s): s is FormSystemStep => s !== null && s !== undefined)
        .filter((s) => s.type === 'Innsláttur')
        .map((s) => (
          <Box key={s.guid}>
            <SelectNavComponent
              type="Step"
              data={s as FormSystemStep}
              active={activeItem?.data?.guid === s.guid}
              selectable={selectable}
            />
            {groups
              ?.filter((g) => g?.stepGuid === s.guid)
              .map((g) => (
                <Box key={g?.guid}>
                  <SelectNavComponent
                    type="Group"
                    data={g as FormSystemGroup}
                    active={activeItem?.data?.guid === g?.guid}
                    selectable={selectable}
                  />
                  {inputs
                    ?.filter((i) => i?.groupGuid === g?.guid)
                    .map((i) => {
                      if (activeItem?.data?.guid === i?.guid) {
                        if (
                          selectStatus !== NavbarSelectStatus.ON_WITHOUT_SELECT
                        ) {
                          selectable = true
                        }
                      }
                      return (
                        <SelectNavComponent
                          key={i?.guid}
                          type="Input"
                          data={i as FormSystemInput}
                          active={activeItem?.data?.guid === i?.guid}
                          selectable={selectable}
                        />
                      )
                    })}
                </Box>
              ))}
          </Box>
        ))}
    </Box>
  )
}
