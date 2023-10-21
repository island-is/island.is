import { toast } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { Area, SubscriptionTypes } from '../../types/enums'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
  SubscriptionArray,
} from '../../types/interfaces'
import {
  useLogIn,
  useSearchSubscriptions,
  useUser,
  useSubscriptions,
  usePostSubscription,
  useFetchSubscriptions,
} from '../../hooks/'
import { SubscriptionsSkeleton, ChosenSubscriptions } from './components'
import { filterSubscriptions as F } from '../../utils/helpers/subscriptions'
import localization from './Subscriptions.json'

interface SubProps {
  allcases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
  isNotAuthorized: boolean
}

export const UserSubscriptions = ({ allcases, types }: SubProps) => {
  const loc = localization['userSubscriptions']
  const { isAuthenticated, userLoading } = useUser()
  const [submitSubsIsLoading, setSubmitSubsIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)
  const [dontShowNew, setDontShowNew] = useState(true)
  const [dontShowChanges, setDontShowChanges] = useState(true)
  const [initData, setInitData] = useState<SubscriptionArray>()
  const LogIn = useLogIn()

  const {
    subscriptionArray,
    setSubscriptionArray,
    sortTitle,
    searchValue,
    tabs,
  } = useSubscriptions({
    types: types,
    cases: allcases,
    dontShowNew: dontShowNew,
    dontShowChanges: dontShowChanges,
    isMySubscriptions: true,
  })

  const { userSubscriptions, getUserSubsLoading, refetchUserSubs } =
    useFetchSubscriptions({
      isAuthenticated: isAuthenticated,
    })

  const { postSubsMutation } = usePostSubscription()

  useEffect(() => {
    if (!getUserSubsLoading) {
      const {
        cases: allCases,
        institutions: allInstitutions,
        policyAreas: allPolicyAreas,
        subscribedToAllNewObj,
        subscribedToAllChangesObj,
      } = subscriptionArray
      const {
        cases: subCases,
        institutions: subInstitutions,
        policyAreas: subPolicyAreas,
        subscribedToAll,
        subscribedToAllType,
      } = userSubscriptions
      if (subscribedToAll) {
        if (subscribedToAllType === SubscriptionTypes.OnlyNew) {
          setDontShowNew(false)
          setDontShowChanges(true)
        } else if (subscribedToAllType === SubscriptionTypes.AllChanges) {
          setDontShowChanges(false)
          setDontShowNew(true)
        }
      } else {
        setDontShowNew(true)
        setDontShowChanges(true)
      }

      if (subCases && subInstitutions && subPolicyAreas) {
        const filteredCases = allCases.filter((item) =>
          subCases.find((i) => i.id === item.id),
        )
        const filteredInstitutions = allInstitutions.filter((item) =>
          subInstitutions?.find((i) => i.id.toString() === item.id),
        )

        const filteredPolicyAreas = allPolicyAreas.filter((item) =>
          subPolicyAreas?.find((i) => i.id.toString() === item.id),
        )

        const objToUse = {
          cases: filteredCases,
          institutions: filteredInstitutions,
          policyAreas: filteredPolicyAreas,
          subscribedToAllNewObj: subscribedToAllNewObj,
          subscribedToAllChangesObj: subscribedToAllChangesObj,
        }
        setSubscriptionArray({ ...objToUse })
        setInitData({ ...objToUse })
      }
    }
  }, [getUserSubsLoading, userSubscriptions])

  const { searchIsLoading } = useSearchSubscriptions({
    searchValue: searchValue,
    sortTitle: sortTitle,
    subscriptionArray: subscriptionArray,
    setSubscriptionArray: setSubscriptionArray,
    initSubs: initData ? initData : subscriptionArray,
  })

  const onSubmit = async () => {
    setSubmitSubsIsLoading(true)

    if (!userLoading && !isAuthenticated) {
      LogIn()
    }

    const {
      cases,
      institutions,
      policyAreas,
      subscribedToAllNewObj,
      subscribedToAllChangesObj,
    } = subscriptionArray

    const filteredCases = F.filterOutChecked(cases)
    const filteredInstitutions = F.filterOutChecked(institutions)
    const filteredPolicyAreas = F.filterOutChecked(policyAreas)
    const subscribeToAll =
      subscribedToAllNewObj.checked || subscribedToAllChangesObj.checked
        ? false
        : userSubscriptions?.subscribedToAll
    const objToSend = {
      caseIds: filteredCases,
      institutionIds: filteredInstitutions,
      policyAreaIds: filteredPolicyAreas,
      subscribeToAll: subscribeToAll,
      subscribeToAllType: userSubscriptions?.subscribedToAllType,
    }
    await postSubsMutation({
      variables: {
        input: objToSend,
      },
    })
      .then(() => {
        onClear()
        setSubmitSubsIsLoading(false)
        refetchUserSubs()
        toast.success(loc.postSubsMutationToasts.success)
      })
      .catch((e) => {
        setSubmitSubsIsLoading(false)
        console.error(e)
        toast.error(loc.postSubsMutationToasts.failure)
      })
    setSubmitSubsIsLoading(false)
  }

  const onClear = () => {
    const {
      cases,
      institutions,
      policyAreas,
      subscribedToAllNewObj,
      subscribedToAllChangesObj,
    } = subscriptionArray
    const casesMapped = cases.map((item) => {
      const obj = {
        ...item,
        checked: false,
      }
      return obj
    })
    const institutionsMapped = institutions.map((item) => {
      const obj = {
        ...item,
        checked: false,
      }
      return obj
    })
    const policyAreasMapped = policyAreas.map((item) => {
      const obj = {
        ...item,
        checked: false,
      }
      return obj
    })
    const allNew = { ...subscribedToAllNewObj }
    const allChanges = { ...subscribedToAllChangesObj }
    allNew.checked = false
    allChanges.checked = false
    const newObj = {
      cases: casesMapped,
      institutions: institutionsMapped,
      policyAreas: policyAreasMapped,
      subscribedToAllNewObj: allNew,
      subscribedToAllChangesObj: allChanges,
    }
    setSubscriptionArray(newObj)
  }

  if (!userLoading && !isAuthenticated) {
    LogIn()
  }

  return (
    <SubscriptionsSkeleton
      isMySubscriptions
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      tabs={tabs}
      getUserSubsLoading={getUserSubsLoading}
    >
      <ChosenSubscriptions
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={setSubscriptionArray}
        onSubmit={onSubmit}
        onClear={onClear}
        buttonText={loc.chosenSubscriptions.buttonText}
        toggleAble={false}
        submitSubsIsLoading={submitSubsIsLoading}
      />
    </SubscriptionsSkeleton>
  )
}
export default UserSubscriptions
