import {
  Checkbox,
  Table as T,
  Text,
  Stack,
  FocusableBox,
  LinkV2,
} from '@island.is/island-ui/core'
import { mapIsToEn } from '../../../../../../utils/helpers'
import * as styles from '../../SubscriptionTable.css'
import { Area } from '../../../../../../types/enums'
import {
  SubscriptionArray,
  SubscriptionTableItem as SubscriptionTableItemType,
} from '../../../../../../types/interfaces'
import localization from '../../../../Subscriptions.json'
import { tableRowBackgroundColor } from '../../../../utils'
import cn from 'classnames'

interface Props {
  item: SubscriptionTableItemType
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

  const Data = ({
    width = '',
    children,
    isLastOrFirst = false,
    isLeft = false,
  }) => {
    const className = isLeft ? styles.tableRowLeft : styles.tableRowRight
    return (
      <TData
        width={width}
        borderColor={borderColor}
        box={{
          background: tableRowBackgroundColor(idx),
          className: cn(
            styles.paddingRightZero,
            isLastOrFirst ? className : '',
          ),
        }}
      >
        {children}
      </TData>
    )
  }

  const LinkBox = ({ children }) => {
    return (
      <FocusableBox
        component={LinkV2}
        href={`${loc.caseHref}${item.id}`}
        target="_blank"
        title={loc.infoText}
        textAlign="left"
      >
        {children}
      </FocusableBox>
    )
  }

  const Stacked = () => {
    return (
      <Stack space={1}>
        <Text variant="medium" fontWeight="semiBold">
          {isGeneralSubscription ? loc.allCases : `S-${item.caseNumber}`}
        </Text>
        <Text variant="medium" fontWeight="light">
          {item.name}
        </Text>
      </Stack>
    )
  }

  return (
    <>
      <Row key={item.key}>
        <Data isLastOrFirst isLeft>
          <Checkbox checked={item.checked} onChange={checkboxHandler} />
        </Data>
        {currentTab !== Area.case ? (
          isGeneralSubscription ? (
            <Data>
              <Text variant="medium" fontWeight="semiBold">
                {loc.allCases}
              </Text>
              <Text variant="medium" fontWeight="light">
                {item.name}
              </Text>
            </Data>
          ) : (
            <Data>
              <Text variant="medium" fontWeight="semiBold">
                {item.name}
              </Text>
            </Data>
          )
        ) : mdBreakpoint ? (
          <>
            <Data>
              <Text variant="medium" fontWeight="semiBold">
                {isGeneralSubscription ? loc.allCases : `S-${item.caseNumber}`}
              </Text>
            </Data>
            <Data>
              {isGeneralSubscription ? (
                <Text variant="medium" fontWeight="light">
                  {item.name}
                </Text>
              ) : (
                <LinkBox>
                  <Text variant="medium" fontWeight="light">
                    {item.name}
                  </Text>
                </LinkBox>
              )}
            </Data>
          </>
        ) : (
          <>
            <Data>
              {isGeneralSubscription ? (
                <Stacked />
              ) : (
                <LinkBox>
                  <Stacked />
                </LinkBox>
              )}
            </Data>
          </>
        )}
        <Data isLastOrFirst>
          <></>
        </Data>
      </Row>
    </>
  )
}

export default SubscriptionTableItem
