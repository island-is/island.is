import {
  Checkbox,
  Table as T,
  Text,
  Stack,
  FocusableBox,
} from '@island.is/island-ui/core'
import { tableRowBackgroundColor } from '../../utils/helpers'
import { Area } from '../../types/enums'

export interface SubscriptionTableItemProps {
  item?: { name: string; title: string; id: string }
  checkboxStatus: boolean
  onCheckboxChange: () => void
  currentTab: Area
  mdBreakpoint: boolean
}

const SubscriptionTableAllItem = ({
  item,
  checkboxStatus,
  onCheckboxChange,
  currentTab,
  mdBreakpoint,
}) => {
  const borderColor = 'transparent'

  const checkboxChange = (item, checked: boolean) => {
    onCheckboxChange(item, checked)
  }

  const { Row, Data: TData } = T

  const Data = ({ width = '', children }) => {
    return (
      <TData
        width={width}
        borderColor={borderColor}
        box={{
          background: tableRowBackgroundColor(item.id == 'OnlyNew' ? 0 : 1),
        }}
      >
        {children}
      </TData>
    )
  }

  return (
    <>
      <Row key={0}>
        <Data width="10">
          <Checkbox
            checked={checkboxStatus(item.id)}
            onChange={(e) => checkboxChange(item, e.target.checked)}
          />
        </Data>
        {currentTab !== Area.case ? (
          <Data>
            <FocusableBox>
              <Text variant="h5">{item.nr}</Text>
            </FocusableBox>
            <FocusableBox>
              <Text variant="medium" fontWeight="light">
                {item.name}
              </Text>
            </FocusableBox>
          </Data>
        ) : mdBreakpoint ? (
          <>
            <Data>
              <FocusableBox>
                <Text variant="h5">{item.nr}</Text>
              </FocusableBox>
            </Data>
            <Data>
              <FocusableBox>
                <Text variant="medium" fontWeight="light">
                  {item.name}
                </Text>
              </FocusableBox>
            </Data>
          </>
        ) : (
          <>
            <Data>
              <FocusableBox>
                <Stack space={1}>
                  <Text variant="h5">{item.nr}</Text>
                  <Text variant="medium" fontWeight="light">
                    {item.name}
                  </Text>
                </Stack>
              </FocusableBox>
            </Data>
          </>
        )}
        <Data>
          <div></div>
        </Data>
      </Row>
    </>
  )
}

export default SubscriptionTableAllItem
