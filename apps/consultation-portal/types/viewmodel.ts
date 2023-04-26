import { SubscriptionItem } from './interfaces'

export const SubscriptionViewmodel = (subs) => {
  const viewmodel: Array<SubscriptionItem> = subs.map((item) => {
    return {
      id: item.id,
      subscriptionType: item.subscriptionType,
    }
  })
  return viewmodel
}
