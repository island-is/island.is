import {
  Checkbox,
  Table as T,
  Text,
  Icon,
  Stack,
  FocusableBox,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { tableRowBackgroundColor } from '../../utils/helpers'
import SubscriptionChoices from '../SubscriptionChoices/SubscriptionChoices'
import * as styles from './SubscriptionTableItem.css'
import { Area } from '../../types/enums'
import { Case } from '../../types/interfaces'

export interface SubscriptionTableItemProps {
  item: Case
  idx: number
  checkboxStatus: boolean
  onCheckboxChange: () => void
  currentTab: Area
  mdBreakpoint: boolean
}

const SubscriptionTableItem = ({
  item,
  idx,
  checkboxStatus,
  onCheckboxChange,
  currentTab,
  mdBreakpoint,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => {
    setIsOpen(!isOpen)
  }

  const borderColor = 'transparent'

  const checkboxChange = (itemId: number, checked: boolean) => {
    onClick()
    onCheckboxChange(itemId, checked)
  }

  const { Row, Data: TData } = T

  const Data = ({ width = '', children }) => {
    return (
      <TData
        width={width}
        borderColor={borderColor}
        box={{ background: tableRowBackgroundColor(idx) }}
      >
        {children}
      </TData>
    )
  }

  return (
    <>
      <Row key={idx}>
        <Data width="10">
          <Checkbox
            checked={checkboxStatus(item.id)}
            onChange={(e) => checkboxChange(item.id, e.target.checked)}
          />
        </Data>
        {currentTab !== Area.case ? (
          <Data>
            <FocusableBox onClick={onClick}>
              <Text variant="h5">{item.name}</Text>
            </FocusableBox>
          </Data>
        ) : mdBreakpoint ? (
          <>
            <Data>
              <FocusableBox onClick={onClick}>
                <Text variant="h5">{item.caseNumber}</Text>
              </FocusableBox>
            </Data>
            <Data>
              <FocusableBox onClick={onClick}>
                <Text variant="medium" fontWeight="light">
                  {item.name}
                </Text>
              </FocusableBox>
            </Data>
          </>
        ) : (
          <>
            <Data>
              <FocusableBox onClick={onClick}>
                <Stack space={1}>
                  <Text variant="h5">{item.caseNumber}</Text>
                  <Text variant="medium" fontWeight="light">
                    {item.name}
                  </Text>
                </Stack>
              </FocusableBox>
            </Data>
          </>
        )}
        <TData
          borderColor={borderColor}
          box={{
            className: styles.tableRowRight,
            background: tableRowBackgroundColor(idx),
          }}
          align="right"
        >
          <FocusableBox
            onClick={onClick}
            style={{ height: '24px' }}
            flexDirection="rowReverse"
          >
            <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} color="blue400" />
          </FocusableBox>
        </TData>
      </Row>
      {isOpen && (
        <Row>
          <TData
            colSpan={4}
            borderColor={borderColor}
            box={{
              paddingTop: 'none',
              background: tableRowBackgroundColor(idx),
            }}
          >
            <SubscriptionChoices />
          </TData>
        </Row>
      )}
    </>
  )
}

export default SubscriptionTableItem
