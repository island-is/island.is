import React from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Checkbox,
} from 'libs/island-ui/core/src'
import BlueBox from '../BlueBox/BlueBox'

interface CheckboxInfo {
  title: string
  id: string
  info: string
}

interface Props {
  checkboxes: CheckboxInfo[]
  selected: string[] | undefined
  onChange: (id: string) => void
}

const CheckboxList: React.FC<Props> = ({
  checkboxes,
  selected,
  onChange,
}: Props) => {
  return (
    <GridContainer>
      <GridRow>
        {checkboxes.map((checkbox, index) => {
          return (
            <GridColumn span="6/12" key={index}>
              <Box
                marginBottom={
                  // Do not add margins to the last two items
                  index < checkboxes.length - 2 ? 3 : 0
                }
              >
                <Checkbox
                  name={checkbox.title}
                  label={checkbox.title}
                  value={checkbox.id}
                  checked={selected && selected.indexOf(checkbox.id) > -1}
                  tooltip={checkbox.info}
                  onChange={({ target }) => onChange(target.value)}
                  large
                  filled
                />
              </Box>
            </GridColumn>
          )
        })}
      </GridRow>
    </GridContainer>
  )
}

export default CheckboxList
