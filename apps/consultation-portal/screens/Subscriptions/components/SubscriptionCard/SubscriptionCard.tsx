import { Box } from '@island.is/island-ui/core'
import { mapIsToEn } from '../../../../utils/helpers'
import { ReactNode, useState } from 'react'
import { Area } from '../../../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem,
} from '../../../../types/interfaces'
import { CardSkeleton } from '../../../../components'
import { CardGridContainer, SubscriptionChoices } from '../../components'

interface Props {
  isGeneralSubscription?: boolean
  isCase?: boolean
  item: SubscriptionTableItem
  area?: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  titleColumn?: ReactNode
  children?: ReactNode
  toggleAble?: boolean
}

export const SubscriptionCard = ({
  isGeneralSubscription,
  item,
  area,
  subscriptionArray,
  setSubscriptionArray,
  titleColumn,
  children,
  toggleAble = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const onCheckboxChange = () => {
    if (isGeneralSubscription) {
      const arrCopy = { ...subscriptionArray }
      const subscribedToAllNewObj = arrCopy.subscribedToAllNewObj
      const subscribedToAllChangesObj = arrCopy.subscribedToAllChangesObj
      if (subscribedToAllNewObj.checked) {
        subscribedToAllNewObj.checked = false
        arrCopy.subscribedToAllNewObj = subscribedToAllNewObj
      } else {
        subscribedToAllChangesObj.checked = false
        arrCopy.subscribedToAllChangesObj = subscribedToAllChangesObj
      }
      setSubscriptionArray(arrCopy)
    } else {
      const subscriptionArrayCopy = { ...subscriptionArray }
      const thisData = subscriptionArrayCopy[mapIsToEn[area]]
      const thisInstance = thisData.findIndex((elem) => elem.key === item.key)
      const oldVal = thisData[thisInstance].checked
      thisData[thisInstance].checked = !oldVal
      subscriptionArrayCopy[mapIsToEn[area]] = thisData
      setSubscriptionArray(subscriptionArrayCopy)

      if ((oldVal && isOpen) || (!oldVal && !isOpen)) {
        setIsOpen(!isOpen)
      }
    }
  }
  const onClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <CardSkeleton
      borderColor="blue400"
      borderRadius="large"
      background="white"
      padding={3}
    >
      <CardGridContainer
        checked={item.checked}
        onChecked={onCheckboxChange}
        isToggleable={toggleAble}
        isToggled={isOpen}
        onToggle={onClick}
      >
        <Box style={{ paddingRight: '8px' }}>{titleColumn}</Box>
        {children}
      </CardGridContainer>
      {!isOpen && toggleAble && (
        <Box paddingTop={3}>
          <SubscriptionChoices
            item={item}
            currentTab={area}
            subscriptionArray={subscriptionArray}
            setSubscriptionArray={setSubscriptionArray}
            onChecked={() => setIsOpen(!isOpen)}
          />
        </Box>
      )}
    </CardSkeleton>
  )
}

export default SubscriptionCard
