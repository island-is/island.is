import React from 'react'
import {
  Table as T,
  Box,
  ResponsiveSpace,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { mapIsToEn } from '../../utils/helpers'
import SubscriptionTableItem from './SubscriptionTableItem'
import { ArrOfIdAndName, Case, SubscriptionArray } from '../../types/interfaces'
import { Area } from '../../types/enums'
import SubscriptionTableAllItem from './SubscriptionTableAllItems'
import SubscriptionTableHeader from './components/SubscriptionTableHeader'
import {
  isSubscriptionTypeChecked,
  onCheckboxChange,
  onSubscriptiontypeChange,
} from './utils/checkboxes'
import { isCheckboxChecked } from './utils/checkboxes'

export interface SubscriptionTableProps {
  data: Array<Case> | Array<ArrOfIdAndName>
  currentTab: Area
  subscriptionArray: SubscriptionArray
  generalSubArray: any
  setSubscriptionArray: (obj: SubscriptionArray) => void
}

const SubscriptionTable = ({
  data,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  generalSubArray,
}: SubscriptionTableProps) => {
  const onAllChecked = (item, action) => {
    let sub = subscriptionArray['generalSubscription']
    const subArr = { ...subscriptionArray }
    if (action) {
      sub = item.id
    } else {
      sub = ''
    }
    subArr['generalSubscription'] = sub
    return setSubscriptionArray(subArr)
  }
  const checkboxAllStatus = (id: string | number) => {
    return subscriptionArray['generalSubscription'] == id
  }

  const paddingTop = [3, 3, 3, 5, 5] as ResponsiveSpace

  const { md: mdBreakpoint } = useBreakpoint()
  const { Table, Body } = T

  return (
    <Box paddingTop={paddingTop}>
      <Table>
        <SubscriptionTableHeader currentTab={currentTab} />
        {data && data.length > 0 && (
          <Body>
            {generalSubArray &&
              generalSubArray.map((item, index) => {
                return (
                  <SubscriptionTableAllItem
                    key={index}
                    item={item}
                    checkboxStatus={checkboxAllStatus}
                    onCheckboxChange={onAllChecked}
                    currentTab={currentTab}
                    mdBreakpoint={mdBreakpoint}
                  />
                )
              })}
            {data.map((item, idx: number) => (
              <SubscriptionTableItem
                key={item.id}
                item={item}
                idx={idx}
                checkboxStatus={(id) =>
                  isCheckboxChecked(
                    id,
                    subscriptionArray[mapIsToEn[currentTab]],
                  )
                }
                IsSubscriptionTypeChecked={(subType, id) =>
                  isSubscriptionTypeChecked(
                    subType,
                    id,
                    subscriptionArray[mapIsToEn[currentTab]],
                  )
                }
                onSubscriptiontypeChange={(subType) =>
                  onSubscriptiontypeChange({
                    subType,
                    subscriptionArray,
                    currentTab,
                    setSubscriptionArray,
                    itemId: parseInt(item.id),
                  })
                }
                onCheckboxChange={(itemId, checked) =>
                  onCheckboxChange({
                    currentTab,
                    subscriptionArray,
                    setSubscriptionArray,
                    itemId,
                    checked,
                  })
                }
                currentTab={currentTab}
                mdBreakpoint={mdBreakpoint}
              />
            ))}
          </Body>
        )}
      </Table>
    </Box>
  )
}

export default SubscriptionTable
