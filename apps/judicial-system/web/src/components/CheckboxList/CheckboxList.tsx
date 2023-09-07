import React from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'

import {
  Box,
  Checkbox,
  GridColumn,
  GridColumns,
  GridContainer,
  GridRow,
  ResponsiveProp,
} from '@island.is/island-ui/core'

export interface CheckboxInfo {
  title: MessageDescriptor
  id: string
  info: MessageDescriptor
}

interface Props {
  checkboxes: CheckboxInfo[]
  selected: string[] | undefined
  onChange: (id: string) => void
  fullWidth?: boolean
}

const CheckboxList: React.FC<React.PropsWithChildren<Props>> = ({
  checkboxes,
  selected,
  onChange,
  fullWidth,
}: Props) => {
  const { formatMessage } = useIntl()
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
                  index < checkboxes.length - 2 ? 2 : 0
                }
              >
                <Checkbox
                  name={formatMessage(checkbox.title)}
                  label={formatMessage(checkbox.title)}
                  value={checkbox.id}
                  checked={selected && selected.indexOf(checkbox.id) > -1}
                  tooltip={formatMessage(checkbox.info)}
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
