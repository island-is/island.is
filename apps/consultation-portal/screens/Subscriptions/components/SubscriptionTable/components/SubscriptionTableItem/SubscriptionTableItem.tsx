import {
  Checkbox,
  Table as T,
  Text,
  Stack,
  FocusableBox,
  LinkV2,
} from '@island.is/island-ui/core'
import { mapIsToEn } from '../../../../../../utils/helpers'
import * as styles from './SubscriptionTableItem.css'
import { Area } from '../../../../../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem,
} from '../../../../../../types/interfaces'
import localization from '../../../../Subscriptions.json'
import { tableRowBackgroundColor } from '../../../../utils'

interface Props {
  item: SubscriptionTableItem
  idx: number
  currentTab: Area
  mdBreakpoint: boolean
  isGeneralSubscription?: boolean
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
}

const SubscriptionTableItem = ({
  item,
  idx,
  currentTab,
  mdBreakpoint,
  isGeneralSubscription,
  subscriptionArray,
  setSubscriptionArray,
}: Props) => {
  const loc = localization.subscriptionTableItem
  const areaIsCaseAndIsNotGeneralSubscription =
    currentTab === Area.case && !isGeneralSubscription
  const borderColor = 'transparent'

  const checkboxHandler = () => {
    if (isGeneralSubscription) {
      const subscriptionArrayCopy = { ...subscriptionArray }
      // idx 0 is All, idx 1 is changes
      if (idx === 0) {
        const thisData = subscriptionArray.subscribedToAllNewObj
        thisData.checked = !thisData.checked
        subscriptionArrayCopy.subscribedToAllNewObj = thisData
        if (thisData.checked) {
          if (subscriptionArrayCopy.subscribedToAllChangesObj.checked) {
            subscriptionArrayCopy.subscribedToAllChangesObj.checked = false
          }
        }
      } else if (idx === 1) {
        const thisData = subscriptionArray.subscribedToAllChangesObj
        thisData.checked = !thisData.checked
        subscriptionArrayCopy.subscribedToAllChangesObj = thisData
        if (thisData.checked) {
          if (subscriptionArrayCopy.subscribedToAllNewObj.checked) {
            subscriptionArrayCopy.subscribedToAllNewObj.checked = false
          }
        }
      }
      setSubscriptionArray(subscriptionArrayCopy)
    } else {
      const subscriptionArrayCopy = { ...subscriptionArray }
      const thisData = subscriptionArrayCopy[mapIsToEn[currentTab]]
      const thisInstance = thisData.findIndex((elem) => elem.key === item.key)
      const oldVal = thisData[thisInstance].checked
      thisData[thisInstance].checked = !oldVal
      subscriptionArrayCopy[mapIsToEn[currentTab]] = thisData
      setSubscriptionArray(subscriptionArrayCopy)
    }
  }

  const { Row, Data: TData } = T

  const Data = ({ width = '', children }) => {
    return (
      <TData
        width={width}
        borderColor={borderColor}
        box={{ background: tableRowBackgroundColor(idx) }}
      >
        {children}
      </TData>
    )
  }

  return (
    <>
      <Row key={item.key}>
        <Data width="10">
          <Checkbox checked={item.checked} onChange={checkboxHandler} />
        </Data>
        {currentTab !== Area.case ? (
          isGeneralSubscription ? (
            <Data>
              <FocusableBox onClick={checkboxHandler}>
                <Text variant="h5">{loc.allCases}</Text>
              </FocusableBox>
              <FocusableBox onClick={checkboxHandler}>
                <Text variant="medium" fontWeight="light">
                  {item.name}
                </Text>
              </FocusableBox>
            </Data>
          ) : (
            <Data>
              <FocusableBox onClick={checkboxHandler}>
                <Text variant="h5">{item.name}</Text>
              </FocusableBox>
            </Data>
          )
        ) : mdBreakpoint ? (
          <>
            <Data>
              <FocusableBox onClick={checkboxHandler}>
                <Text variant="h5">
                  {isGeneralSubscription ? loc.allCases : item.caseNumber}
                </Text>
              </FocusableBox>
            </Data>
            <Data>
              <FocusableBox onClick={checkboxHandler}>
                <Text variant="medium" fontWeight="light">
                  {item.name}
                </Text>
              </FocusableBox>
            </Data>
          </>
        ) : (
          <>
            <Data>
              <FocusableBox onClick={checkboxHandler}>
                <Stack space={1}>
                  <Text variant="h5">
                    {isGeneralSubscription ? loc.allCases : item.caseNumber}
                  </Text>
                  <Text variant="medium" fontWeight="light">
                    {item.name}
                  </Text>
                </Stack>
              </FocusableBox>
            </Data>
          </>
        )}

        <TData
          borderColor={borderColor}
          box={{
            className: styles.tableRowRight,
            background: tableRowBackgroundColor(idx),
          }}
          align="right"
        >
          {areaIsCaseAndIsNotGeneralSubscription && (
            <FocusableBox
              component={LinkV2}
              href={`${loc.caseHref}${item.id}`}
              target="_blank"
              title={loc.infoText}
            >
              <Text variant="small" color="dark200" fontWeight="light">
                {loc.linkText}
              </Text>
            </FocusableBox>
          )}
        </TData>
      </Row>
    </>
  )
}

export default SubscriptionTableItem
