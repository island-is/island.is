import React from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Checkbox,
  ResponsiveProp,
  GridColumns,
} from '@island.is/island-ui/core'
interface CheckboxInfo {
  title: string
  id: string
  info: string
}

interface Props {
  checkboxes: CheckboxInfo[]
  selected: string[] | undefined
  onChange: (id: string) => void
  fullWidth?: boolean
}

const CheckboxList: React.FC<Props> = ({
  checkboxes,
  selected,
  onChange,
  fullWidth,
}: Props) => {
  return (
    <GridContainer>
      <GridRow>
        {checkboxes.map((checkbox, index) => {
          return (
            <GridColumn
              span={
                `${fullWidth ? '12' : '6'}/12` as ResponsiveProp<GridColumns>
              }
              key={index}
            >
              <Box
                data-testid="checkbox"
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
