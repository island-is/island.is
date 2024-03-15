import { useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import { Area, SubscriptionTypes } from '../../types/enums'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import {
  useLogIn,
  useSearchSubscriptions,
  useUser,
  useSubscriptions,
  useFetchSubscriptions,
  usePostSubscription,
} from '../../hooks'
import { SubscriptionsSkeleton, ChosenSubscriptions } from './components'
import { filterSubscriptions as F } from '../../utils/helpers/subscriptions'
import localization from './Subscriptions.json'

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

const SubscriptionsScreen = ({ cases, types }: SubProps) => {
  const loc = localization['subscriptions']
  const { isAuthenticated } = useUser()
  const [currentTab, setCurrentTab] = useState<Area>(Area.case)
  const {
    initSubs,
    subscriptionArray,
    setSubscriptionArray,
    sortTitle,
    searchValue,
    tabs,
  } = useSubscriptions({ types: types, cases: cases })
  const [submitSubsIsLoading, setSubmitSubsIsLoading] = useState(false)
  const LogIn = useLogIn()

  const { userSubscriptions, getUserSubsLoading } = useFetchSubscriptions({
    isAuthenticated: isAuthenticated,
  })

  const { postSubsMutation } = usePostSubscription()

  useSearchSubscriptions({
    searchValue: searchValue,
    sortTitle: sortTitle,
    subscriptionArray: subscriptionArray,
    setSubscriptionArray: setSubscriptionArray,
    initSubs: initSubs,
  })

  const onSubmit = async () => {
    setSubmitSubsIsLoading(true)

    if (!isAuthenticated) {
      LogIn()
    }

    const {
      cases: preCases,
      institutions: preInstitutions,
      policyAreas: prePolicyAreas,
      subscribedToAll: preSubscribedToAll,
      subscribedToAllType: preSubscribedToAllType,
    } = userSubscriptions

    const {
      cases: subCases,
      institutions: subInstitutions,
      policyAreas: subPolicyAreas,
      subscribedToAllNewObj: subSubscribedToAllNewObj,
      subscribedToAllChangesObj: subSubscribedToAllChangesObj,
    } = subscriptionArray

    const filteredSubCases = F.filterOutUnChecked(subCases)
    const filteredSubInstitutions = F.filterOutUnChecked(subInstitutions)
    const filteredSubPolicyAreas = F.filterOutUnChecked(subPolicyAreas)

    const casesNoChange = F.filterOutExistingSubs(preCases, filteredSubCases)
    const institutionsNoChange = F.filterOutExistingSubs(
      preInstitutions,
      filteredSubInstitutions,
    )
    const policyAreasNoChange = F.filterOutExistingSubs(
      prePolicyAreas,
      filteredSubPolicyAreas,
    )

    const _cases = [...filteredSubCases, ...casesNoChange]
    const _institutions = [...filteredSubInstitutions, ...institutionsNoChange]
    const _policyAreas = [...filteredSubPolicyAreas, ...policyAreasNoChange]
    const _subscribedToAll =
      subSubscribedToAllNewObj.checked || subSubscribedToAllChangesObj.checked
        ? true
        : preSubscribedToAll
    const _subscribedToAllType = _subscribedToAll
      ? subSubscribedToAllNewObj.checked
        ? SubscriptionTypes.OnlyNew
        : SubscriptionTypes.AllChanges
      : preSubscribedToAllType

    const objToSend = {
      caseIds: _cases,
      institutionIds: _institutions,
      policyAreaIds: _policyAreas,
      subscribeToAll: _subscribedToAll,
      subscribeToAllType: _subscribedToAllType,
    }

    await postSubsMutation({
      variables: {
        input: objToSend,
      },
    })
      .then(() => {
        onClear()
        setSubmitSubsIsLoading(false)
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
    setSubscriptionArray(initSubs)
  }

  return (
    <SubscriptionsSkeleton
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
        submitSubsIsLoading={submitSubsIsLoading}
      />
    </SubscriptionsSkeleton>
  )
}

export default SubscriptionsScreen
