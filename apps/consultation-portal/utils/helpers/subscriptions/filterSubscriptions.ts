import { SubscriptionTypeKey } from '../../../types/enums'

export const filterOutExistingSubs = (oldArray, newArray) => {
  const updatedArray = oldArray
    .filter((item) => !newArray.find((i) => i.id === item.id))
    .map((x) => {
      const obj = {
        id: x.id,
        subscriptionType: x.subscriptionType,
      }
      return obj
    })
  return updatedArray
}

export const filterOutUnChecked = (oldArray) => {
  const updatedArray = oldArray
    .filter((item) => item.checked)
    .map((i) => {
      const obj = {
        id: parseInt(i.id),
        subscriptionType: SubscriptionTypeKey[i.subscriptionType],
      }
      return obj
    })
  return updatedArray
}

export const filterOutChecked = (oldArray) => {
  const updatedArray = oldArray
    .filter((item) => !item.checked)
    .map((i) => {
      const obj = {
        id: parseInt(i.id),
        subscriptionType: SubscriptionTypeKey[i.subscriptionType],
      }
      return obj
    })
  return updatedArray
}
