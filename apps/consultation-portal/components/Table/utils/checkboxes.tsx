import { Area } from '../../../types/enums'
import { SubscriptionItem, SubscriptionArray } from '../../../types/interfaces'
import { mapIsToEn } from '../../../utils/helpers'

export interface CheckboxProps {
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (obj: SubscriptionArray) => void
  checked: boolean
  itemId: number
}
interface SubscriptionCheckboxProps {
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (obj: SubscriptionArray) => void
  itemId: number
  subType: string
}

export const onCheckboxChange = ({
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  checked,
  itemId,
}: CheckboxProps) => {
  const sub = [...subscriptionArray[mapIsToEn[currentTab]]]
  const subArr = { ...subscriptionArray }
  const idx = sub.findIndex((x) => x.id == itemId)
  if (!checked) {
    sub.splice(idx, 1)
  } else if (idx < 0) {
    const checkItem: SubscriptionItem = {
      id: itemId,
      subscriptionType: 'AllChanges',
    }
    sub.push(checkItem)
  } else {
    sub.map((sb) => {
      if (sb.id == itemId) {
        sb.subscriptionType = sub[idx].subscriptionType
      }
      return sb
    })
  }

  subArr[mapIsToEn[currentTab]] = sub
  return setSubscriptionArray(subArr)
}

export const isCheckboxChecked = (
  id: string | number,
  subArray: Array<any>,
) => {
  if (subArray) {
    return subArray.findIndex((x) => x.id == id) > -1
  } else return false
}

export const isSubscriptionTypeChecked = (subType: string, id, subArray) => {
  if (subArray && subArray.length > 0) {
    const indexOfSubscriptionType = subArray.findIndex(
      (x) => x.subscriptionType == subType && x.id == parseInt(id),
    )
    return indexOfSubscriptionType > -1
  } else if (subType == 'AllChanges') {
    return true
  } else return false
}

export const onSubscriptiontypeChange = ({
  subType,
  subscriptionArray,
  currentTab,
  setSubscriptionArray,
  itemId,
}: SubscriptionCheckboxProps) => {
  let sub = [...subscriptionArray[mapIsToEn[currentTab]]]
  const subArr = { ...subscriptionArray }
  sub = sub.map((sb) => {
    if (sb.id == itemId) {
      sb.subscriptionType = subType
    }
    return sb
  })
  subArr[mapIsToEn[currentTab]] = sub
  return setSubscriptionArray(subArr)
}
