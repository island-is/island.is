import { Box, FocusableBox } from '@island.is/island-ui/core'
import { mapIsToEn } from '../../../../utils/helpers'
import { ReactNode, useState } from 'react'
import SubscriptionChoices from '../SubscriptionChoices/SubscriptionChoices'
import { Area } from '../../../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem,
} from '../../../../types/interfaces'
import { SimpleCardSkeleton } from '../../../../components/Card/components/SimpleCardSkeleton'
import { CardGridContainer } from '../../../../components/Card/components/CardGridContainer'

export interface ChosenSubscriptionCardProps {
  isGeneralSubscription?: boolean
  isCase?: boolean
  item: SubscriptionTableItem
  idx?: number
  area?: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  titleColumn?: ReactNode
  children?: ReactNode
  toggleAble?: boolean
}

export const ChosenSubscriptionCard = ({
  isGeneralSubscription,
  item,
  area,
  idx,
  subscriptionArray,
  setSubscriptionArray,
  titleColumn,
  children,
  toggleAble = false,
}: ChosenSubscriptionCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const onCheckboxChange = () => {
    if (isGeneralSubscription) {
      const subscriptionArrayCopy = { ...subscriptionArray }
      if (idx === 0) {
        const thisData = subscriptionArray.subscribedToAllNewObj
        thisData.checked = false
        subscriptionArrayCopy.subscribedToAllNewObj = thisData
      } else if (idx === 1) {
        const thisData = subscriptionArray.subscribedToAllChangesObj
        thisData.checked = false
        subscriptionArrayCopy.subscribedToAllChangesObj = thisData
      }
      setSubscriptionArray(subscriptionArrayCopy)
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
    <SimpleCardSkeleton
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
        <FocusableBox onClick={onClick} style={{ minHeight: '24px' }}>
          {titleColumn}
        </FocusableBox>
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
    </SimpleCardSkeleton>
  )
}

export default ChosenSubscriptionCard
