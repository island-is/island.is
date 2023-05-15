import { ArrOfIdAndName, CaseForSubscriptions } from '../../../types/interfaces'
import { createUUIDString } from '../createUUIDString'
import { SubscriptionType } from '../../../types/enums'

interface Props {
  casesData: Array<CaseForSubscriptions>
  institutionsData: Array<ArrOfIdAndName>
  policyAreasData: Array<ArrOfIdAndName>
}

const initSubscriptions = ({
  casesData,
  institutionsData,
  policyAreasData,
}: Props) => {
  const casesObj = casesData.map((item) => {
    const addToObj = {
      key: createUUIDString(),
      checked: false,
      subscriptionType: SubscriptionType.AllChanges,
    }
    return { ...item, ...addToObj }
  })

  const institutionsObj = institutionsData.map((item) => {
    const addToObj = {
      key: createUUIDString(),
      checked: false,
      subscriptionType: SubscriptionType.AllChanges,
    }
    return { ...item, ...addToObj }
  })

  const policyAreasObj = policyAreasData.map((item) => {
    const addToObj = {
      key: createUUIDString(),
      checked: false,
      subscriptionType: SubscriptionType.AllChanges,
    }
    return { ...item, ...addToObj }
  })

  const subscribedToAllNewObj = {
    key: createUUIDString(),
    checked: false,
    name: 'Tilkynningar um ný mál',
    subscriptionType: SubscriptionType.OnlyNew,
  }

  const subscribedToAllChangesObj = {
    key: createUUIDString(),
    checked: false,
    name:
      'Tilkynningar um ný mál, breyttan umsagnarfrest, umsagnarfrest sem er að renna út og birtingu niðurstaðna',
    subscriptionType: SubscriptionType.AllChanges,
  }

  return {
    cases: casesObj,
    institutions: institutionsObj,
    policyAreas: policyAreasObj,
    subscribedToAllNewObj: subscribedToAllNewObj,
    subscribedToAllChangesObj: subscribedToAllChangesObj,
  }
}

export default initSubscriptions
