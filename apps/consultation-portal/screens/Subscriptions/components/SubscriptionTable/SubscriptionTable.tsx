import React from 'react'
import {
  Stack,
  Table as T,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { mapIsToEn } from '../../../../utils/helpers'
import { SubscriptionArray } from '../../../../types/interfaces'
import { Area } from '../../../../types/enums'
import { SubscriptionTableItem, SubscriptionTableHeader } from './components'
import localization from '../../Subscriptions.json'

interface Props {
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  dontShowNew?: boolean
  dontShowChanges?: boolean
  searchValue?: string
  isMySubscriptions?: boolean
}

const SubscriptionTable = ({
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  dontShowNew,
  dontShowChanges,
  searchValue,
  isMySubscriptions,
}: Props) => {
  const { md: mdBreakpoint } = useBreakpoint()
  const { Table, Body } = T
  const loc = localization.subscriptionTable

  const { subscribedToAllNewObj, subscribedToAllChangesObj } = subscriptionArray
  const thisData = subscriptionArray[mapIsToEn[currentTab]]

  if (
    thisData.length === 0 &&
    !subscribedToAllNewObj.checked &&
    !subscribedToAllChangesObj.checked
  ) {
    return (
      <Stack space={1}>
        <Text variant="medium">
          {isMySubscriptions
            ? `${
                loc.mySubscriptionNotFoundText
              } ${currentTab.toLocaleLowerCase()}`
            : `${
                loc.subscriptionNotFoundText
              } ${currentTab.toLocaleLowerCase()}`}
        </Text>
        {searchValue && <Text variant="small">{loc.clearSearchText}</Text>}
      </Stack>
    )
  }

  return (
    <Table>
      <SubscriptionTableHeader currentTab={currentTab} />
      <Body>
        {dontShowNew ? (
          <></>
        ) : (
          <SubscriptionTableItem
            key={subscribedToAllNewObj.key}
            item={subscribedToAllNewObj}
            idx={0}
            mdBreakpoint={mdBreakpoint}
            currentTab={currentTab}
            isGeneralSubscription
            subscriptionArray={subscriptionArray}
            setSubscriptionArray={setSubscriptionArray}
          />
        )}
        {dontShowChanges ? (
          <></>
        ) : (
          <SubscriptionTableItem
            key={subscribedToAllChangesObj.key}
            item={subscribedToAllChangesObj}
            idx={1}
            mdBreakpoint={mdBreakpoint}
            currentTab={currentTab}
            isGeneralSubscription
            subscriptionArray={subscriptionArray}
            setSubscriptionArray={setSubscriptionArray}
          />
        )}

        {thisData &&
          thisData.length > 0 &&
          thisData.map((item, idx) => {
            return (
              <SubscriptionTableItem
                key={item.key}
                item={item}
                idx={idx}
                mdBreakpoint={mdBreakpoint}
                currentTab={currentTab}
                subscriptionArray={subscriptionArray}
                setSubscriptionArray={setSubscriptionArray}
              />
            )
          })}
      </Body>
    </Table>
  )
}

export default SubscriptionTable
