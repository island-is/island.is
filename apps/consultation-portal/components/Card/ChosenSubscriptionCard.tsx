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
import {
  isSubscriptionTypeChecked,
  onCheckboxChange,
  onSubscriptiontypeChange,
} from '../Table/utils/checkboxes'

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
  const handleCheckboxChange = (checked, close = true) => {
    if (close) {
      onClick()
    }
    onCheckboxChange({
      currentTab: data.area,
      subscriptionArray,
      setSubscriptionArray,
      checked,
      itemId: parseInt(data.id),
    })
  }

  const { area, id } = data

  if (data?.id === 'OnlyNew' || data?.id === 'AllChanges') {
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
              onChange={(e) => handleCheckboxChange(e.target.checked)}
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
            onChange={(e) => handleCheckboxChange(e.target.checked)}
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
        <SubscriptionChoices
          itemId={data.id}
          id="chosen"
          checkboxCheck={(subType, id) =>
            isSubscriptionTypeChecked(
              subType,
              id,
              subscriptionArray[mapIsToEn[data.area]],
            )
          }
          checkboxChange={(subType) =>
            onSubscriptiontypeChange({
              subType,
              subscriptionArray,
              currentTab: area,
              setSubscriptionArray,
              itemId: parseInt(id),
            })
          }
        />
      )}
    </Box>
  )
}

export default ChosenSubscriptionCard
