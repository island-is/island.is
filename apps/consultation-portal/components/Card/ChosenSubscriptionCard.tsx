import {
  Box,
  Checkbox,
  FocusableBox,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { mapIsToEn } from '../../utils/helpers'
import { useState } from 'react'
import SubscriptionChoices from '../SubscriptionChoices/SubscriptionChoices'
import { Area } from '../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem,
} from '../../types/interfaces'

export interface ChosenSubscriptionCardProps {
  isGeneralSubscription?: boolean
  item: SubscriptionTableItem
  idx?: number
  area?: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
}

const ChosenSubscriptionCardSkeleton = ({ children }) => {
  return (
    <Box
      borderColor={'blue400'}
      borderRadius="large"
      borderWidth="standard"
      background="white"
      padding={3}
      rowGap={3}
    >
      {children}
    </Box>
  )
}

export const ChosenSubscriptionCard = ({
  isGeneralSubscription,
  item,
  area,
  idx,
  subscriptionArray,
  setSubscriptionArray,
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

  if (isGeneralSubscription) {
    return (
      <ChosenSubscriptionCardSkeleton>
        <Box display="flex" flexDirection="row" justifyContent={'spaceBetween'}>
          <Box display="flex" flexDirection="row" columnGap={3}>
            <Checkbox
              checked={item.checked}
              onChange={() => onCheckboxChange()}
            />
            <Box>
              <Text lineHeight="sm" variant="h5" color={'dark400'}>
                Öll mál
              </Text>
            </Box>
            <Box>
              <Text variant="medium">{item.name}</Text>
            </Box>
          </Box>
          <Box style={{ height: '24px' }} />
        </Box>
      </ChosenSubscriptionCardSkeleton>
    )
  }
  return (
    <ChosenSubscriptionCardSkeleton>
      <Box display="flex" flexDirection="row" justifyContent={'spaceBetween'}>
        <Box display="flex" flexDirection="row" columnGap={3}>
          <Checkbox
            checked={item.checked}
            onChange={() => onCheckboxChange()}
          />
          <FocusableBox onClick={onClick}>
            <Text
              lineHeight="sm"
              variant="h5"
              color={area === Area.case ? 'dark400' : 'blue400'}
            >
              {area === Area.case ? item.caseNumber : item.name}
            </Text>
          </FocusableBox>
          {area === Area.case && (
            <FocusableBox onClick={onClick}>
              <Text variant="medium">{item.name}</Text>
            </FocusableBox>
          )}
        </Box>
        <FocusableBox onClick={onClick} style={{ height: '24px' }}>
          <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} color="blue400" />
        </FocusableBox>
      </Box>
      {!isOpen && (
        <Box paddingTop={3}>
          <SubscriptionChoices
            item={item}
            currentTab={area}
            subscriptionArray={subscriptionArray}
            setSubscriptionArray={setSubscriptionArray}
          />
        </Box>
      )}
    </ChosenSubscriptionCardSkeleton>
  )
}

export default ChosenSubscriptionCard
