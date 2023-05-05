import React from 'react'
import { Table as T, useBreakpoint } from '@island.is/island-ui/core'
import { mapIsToEn } from '../../utils/helpers'
import SubscriptionTableItem from './SubscriptionTableItem'
import { SubscriptionArray } from '../../types/interfaces'
import { Area } from '../../types/enums'
import SubscriptionTableHeader from './components/SubscriptionTableHeader'

export interface SubscriptionTableProps {
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  dontShowNew?: boolean
  dontShowChanges?: boolean
}

const SubscriptionTable = ({
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
  dontShowNew,
  dontShowChanges,
}: SubscriptionTableProps) => {
  const { md: mdBreakpoint } = useBreakpoint()
  const { Table, Body } = T

  const { subscribedToAllNewObj, subscribedToAllChangesObj } = subscriptionArray
  const thisData = subscriptionArray[mapIsToEn[currentTab]]

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
