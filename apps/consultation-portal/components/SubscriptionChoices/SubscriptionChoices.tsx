import { ReactNode } from 'react'
import { Area, SubscriptionType } from '../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem,
} from '../../types/interfaces'
import { mapIsToEn } from '../../utils/helpers'
import { Box, Checkbox, Inline } from '@island.is/island-ui/core'
interface CProps {
  children: ReactNode
}

const CheckboxBox = ({ children }: CProps) => {
  return (
    <Box
      padding={2}
      background="blue100"
      borderColor="blue400"
      borderRadius="standard"
      border="standard"
    >
      {children}
    </Box>
  )
}
interface Props {
  item: SubscriptionTableItem
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  onChecked?: () => void
}

const SubscriptionChoices = ({
  item,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  onChecked,
}: Props) => {
  const allKey = `${item.key}_all`
  const statusKey = `${item.key}_status`

  const onCheckboxChange = (subscriptionType: SubscriptionType) => {
    const subscriptionArrayCopy = { ...subscriptionArray }
    const thisData = subscriptionArrayCopy[mapIsToEn[currentTab]]
    const thisInstance = thisData.findIndex((elem) => elem.key === item.key)
    if (thisData[thisInstance].subscriptionType !== subscriptionType)
      thisData[thisInstance].subscriptionType = subscriptionType
    subscriptionArrayCopy[mapIsToEn[currentTab]] = thisData
    setSubscriptionArray(subscriptionArrayCopy)
    onChecked()
  }

  return (
    <Box>
      <Inline collapseBelow="lg" space="gutter">
        <CheckboxBox>
          <Checkbox
            id={allKey}
            label="Allar breytingar"
            checked={Boolean(
              item.subscriptionType === SubscriptionType.AllChanges,
            )}
            onChange={() => onCheckboxChange(SubscriptionType.AllChanges)}
          />
        </CheckboxBox>
        <CheckboxBox>
          <Checkbox
            id={statusKey}
            label="Einungis ný mál"
            checked={Boolean(
              item.subscriptionType === SubscriptionType.OnlyNew,
            )}
            onChange={() => onCheckboxChange(SubscriptionType.OnlyNew)}
          />
        </CheckboxBox>
      </Inline>
    </Box>
  )
}

export default SubscriptionChoices
