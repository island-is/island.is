import {
  Box,
  Checkbox,
  Column,
  Columns,
  FocusableBox,
  GridContainer,
  Icon,
  Inline,
} from '@island.is/island-ui/core'
import { ReactNode } from 'react'

interface GridProps {
  checked: boolean
  onChecked: () => void
  children: ReactNode
  isToggleable?: boolean
  onToggle?: () => void
  isToggled?: boolean
}

const CardGridContainer = ({
  children,
  checked,
  onChecked,
  isToggleable = false,
  isToggled,
  onToggle,
}: GridProps) => {
  return (
    <GridContainer>
      <Columns align={'left'}>
        <Column width="content">
          <Box marginRight={1}>
            <Checkbox checked={checked} onChange={() => onChecked()} />
          </Box>
        </Column>

        <Column>
          <Inline collapseBelow="md" alignY="center">
            {children}
          </Inline>
        </Column>
        {isToggleable && (
          <Column width="content">
            <FocusableBox
              component="button"
              onClick={onToggle}
              style={{ height: '24px' }}
            >
              <Icon
                icon={!isToggled ? 'chevronUp' : 'chevronDown'}
                color="blue400"
              />
            </FocusableBox>
          </Column>
        )}
      </Columns>
    </GridContainer>
  )
}

export default CardGridContainer
