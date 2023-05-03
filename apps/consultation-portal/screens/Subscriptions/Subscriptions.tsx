import { toast } from '@island.is/island-ui/core'
import { useState } from 'react'
import { Area, SubscriptionTypeKey } from '../../types/enums'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import { useLogIn, useSearchSubscriptions, useUser } from '../../utils/helpers'
import usePostSubscription from '../../utils/helpers/api/usePostSubscription'
import SubscriptionsSkeleton from '../../components/SubscriptionsSkeleton/SubscriptionsSkeleton'
import ChosenSubscriptions from '../../components/ChosenSubscriptions/ChosenSubscriptions'
import { useFetchSubscriptions } from '../../utils/helpers/api/useFetchSubscriptions'
import { useSubscriptions } from '../../utils/helpers/subscriptions'

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

const SubscriptionsScreen = ({ cases, types }: SubProps) => {
  const { isAuthenticated, userLoading } = useUser()
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

  const { userSubscriptions } = useFetchSubscriptions({
    isAuthenticated: isAuthenticated,
  })

  const { postSubsMutation } = usePostSubscription()

  const { searchIsLoading } = useSearchSubscriptions({
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

    const filteredSubCases = subCases
      .filter((item) => item.checked)
      .map((i) => {
        const obj = {
          id: i.id,
          subscriptionType: SubscriptionTypeKey[i.subscriptionType],
        }
        return obj
      })
    const filteredSubInstitutions = subInstitutions
      .filter((item) => item.checked)
      .map((i) => {
        const obj = {
          id: parseInt(i.id),
          subscriptionType: SubscriptionTypeKey[i.subscriptionType],
        }
        return obj
      })
    const filteredSubPolicyAreas = subPolicyAreas
      .filter((item) => item.checked)
      .map((i) => {
        const obj = {
          id: parseInt(i.id),
          subscriptionType: SubscriptionTypeKey[i.subscriptionType],
        }
        return obj
      })

    const casesNoChange = preCases
      .filter((item) => !filteredSubCases.find((i) => i.id === item.id))
      .map((x) => {
        const obj = {
          id: x.id,
          subscriptionType: x.subscriptionType,
        }
        return obj
      })
    const institutionsNoChange = preInstitutions
      .filter((item) => !filteredSubInstitutions.find((i) => i.id === item.id))
      .map((x) => {
        const obj = {
          id: parseInt(x.id),
          subscriptionType: x.subscriptionType,
        }
        return obj
      })
    const policyAreasNoChange = prePolicyAreas
      .filter((item) => !filteredSubPolicyAreas.find((i) => i.id === item.id))
      .map((x) => {
        const obj = {
          id: parseInt(x.id),
          subscriptionType: x.subscriptionType,
        }
        return obj
      })

    const _cases = [...filteredSubCases, ...casesNoChange]
    const _institutions = [...filteredSubInstitutions, ...institutionsNoChange]
    const _policyAreas = [...filteredSubPolicyAreas, ...policyAreasNoChange]
    const _subscribedToAll =
      subSubscribedToAllNewObj.checked || subSubscribedToAllChangesObj.checked
        ? true
        : preSubscribedToAll
    const _subscribedToAllType = _subscribedToAll
      ? subSubscribedToAllNewObj.checked
        ? 'OnlyNew'
        : 'AllChanges'
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
        toast.success('Áskrift skráð')
      })
      .catch((e) => {
        setSubmitSubsIsLoading(false)
        console.error(e)
        toast.error('Ekki tókst að skrá áskriftir')
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
    >
      <ChosenSubscriptions
        subscriptionArray={subscriptionArray}
        setSubscriptionArray={setSubscriptionArray}
        onSubmit={onSubmit}
        onClear={onClear}
        buttonText="Skrá í áskrift"
        submitSubsIsLoading={submitSubsIsLoading}
      />
    </SubscriptionsSkeleton>
  )
}

export default SubscriptionsScreen
