import {
  Checkbox,
  Table as T,
  Text,
  Stack,
  FocusableBox,
  LinkV2,
  Box,
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
  isGeneralSubscription?: boolean
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
}

const SubscriptionTableItem = ({
  item,
  idx,
  currentTab,
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
        height="full"
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

  const Stacked = ({
    upperText,
    lowerText,
  }: {
    upperText: string
    lowerText: string
  }) => {
    return (
      <Stack space={0}>
        <Text variant="medium" fontWeight="semiBold">
          {upperText}
        </Text>
        <Text variant="medium" fontWeight="light">
          {lowerText}
        </Text>
      </Stack>
    )
  }

  const areaIsNotCase = currentTab !== Area.case

  const LabelBox = () => {
    if (isGeneralSubscription) {
      return <Stacked upperText={loc.allCases} lowerText={item.name} />
    }
    if (areaIsNotCase) {
      return (
        <Text variant="medium" fontWeight="semiBold">
          {item.name}
        </Text>
      )
    }
    return (
      <LinkBox>
        <Stacked upperText={`S-${item.caseNumber}`} lowerText={item.name} />
      </LinkBox>
    )
  }

  return (
    <Row key={item.key}>
      <Data isLastOrFirst isLeft>
        <Checkbox
          label={
            <Box marginLeft={1}>
              <LabelBox />
            </Box>
          }
          checked={item.checked}
          onChange={checkboxHandler}
          name={`checkbox-for-${item.key}`}
        />
      </Data>
      <Data isLastOrFirst>
        <></>
      </Data>
    </Row>
  )
}

export default SubscriptionTableItem
