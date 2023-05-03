import { Area, SubscriptionType } from '../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem,
} from '../../types/interfaces'
import { mapIsToEn } from '../../utils/helpers'
import { Box, Checkbox, Inline } from '@island.is/island-ui/core'

interface Props {
  item: SubscriptionTableItem
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
}

const SubscriptionChoices = ({
  item,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
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
  }

  return (
    <Box>
      <Inline
        collapseBelow="lg"
        alignY="center"
        justifyContent="spaceAround"
        space="gutter"
      >
        <Checkbox
          id={allKey}
          large
          backgroundColor="blue"
          label="Fá allar tilkynningar um mál"
          checked={Boolean(
            item.subscriptionType === SubscriptionType.AllChanges,
          )}
          onChange={() => onCheckboxChange(SubscriptionType.AllChanges)}
        />
        <Checkbox
          id={statusKey}
          large
          backgroundColor="blue"
          label="Tilkynningar um breytingar"
          checked={Boolean(
            item.subscriptionType === SubscriptionType.StatusChanges,
          )}
          onChange={() => onCheckboxChange(SubscriptionType.StatusChanges)}
        />
      </Inline>
    </Box>
  )
}

export default SubscriptionChoices
