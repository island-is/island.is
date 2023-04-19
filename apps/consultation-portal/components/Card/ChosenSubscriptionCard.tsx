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
import { SubscriptionArray } from '../../types/interfaces'

export interface ChosenSubscriptionCardProps {
  data: {
    name: string
    caseNumber?: string
    id: string
    area: Area
  }
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (arr: SubscriptionArray) => void
}

export const ChosenSubscriptionCard = ({
  data,
  subscriptionArray,
  setSubscriptionArray,
}: ChosenSubscriptionCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => {
    setIsOpen(!isOpen)
  }

  const onCheckboxChange = (id: string | number) => {
    const sub = [...subscriptionArray[mapIsToEn[data.area]]]
    const subArr = { ...subscriptionArray }
    if (typeof id === 'string') {
      let generalsub = subscriptionArray['generalSubscription']
      generalsub = ''
      subArr['generalSubscription'] = generalsub
    } else {
      const idx = sub.indexOf(id)
      sub.splice(idx, 1)
      subArr[mapIsToEn[data.area]] = sub
    }

    return setSubscriptionArray(subArr)
  }
  if (typeof data?.id === 'string') {
    return (
      <Box
        borderColor={'blue400'}
        borderRadius="large"
        borderWidth="standard"
        background="white"
        paddingX={3}
        paddingY={3}
        rowGap={3}
      >
        <Box display="flex" flexDirection="row" justifyContent={'spaceBetween'}>
          <Box display="flex" flexDirection="row" columnGap={3}>
            <Checkbox
              checked={true}
              onChange={() => onCheckboxChange(data?.id)}
            />
            <Box>
              <Text
                lineHeight="sm"
                variant="h5"
                color={data?.area === 'Mál' ? 'dark400' : 'blue400'}
              >
                {data?.area === 'Mál' ? data?.caseNumber : data?.name}
              </Text>
            </Box>
            {data?.area === 'Mál' && (
              <Box>
                <Text variant="medium">{data?.name}</Text>
              </Box>
            )}
          </Box>
          <Box style={{ height: '24px' }}></Box>
        </Box>
      </Box>
    )
  }
  return (
    <Box
      borderColor={'blue400'}
      borderRadius="large"
      borderWidth="standard"
      background="white"
      paddingX={3}
      paddingY={3}
      rowGap={3}
    >
      <Box display="flex" flexDirection="row" justifyContent={'spaceBetween'}>
        <Box display="flex" flexDirection="row" columnGap={3}>
          <Checkbox
            checked={true}
            onChange={() => onCheckboxChange(data?.id)}
          />
          <FocusableBox onClick={onClick}>
            <Text
              lineHeight="sm"
              variant="h5"
              color={data?.area === 'Mál' ? 'dark400' : 'blue400'}
            >
              {data?.area === 'Mál' ? data?.caseNumber : data?.name}
            </Text>
          </FocusableBox>
          {data?.area === 'Mál' && (
            <FocusableBox onClick={onClick}>
              <Text variant="medium">{data?.name}</Text>
            </FocusableBox>
          )}
        </Box>
        <FocusableBox onClick={onClick} style={{ height: '24px' }}>
          <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} color="blue400" />
        </FocusableBox>
      </Box>
      {isOpen && (
        <Box paddingTop={3}>
          <SubscriptionChoices />
        </Box>
      )}
    </Box>
  )
}

export default ChosenSubscriptionCard
