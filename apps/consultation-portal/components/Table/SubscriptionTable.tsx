import React from 'react'
import {
  Icon,
  Table as T,
  Box,
  ResponsiveSpace,
  useBreakpoint,
} from '@island.is/island-ui/core'
import * as styles from './SubscriptionTable.css'
import { mapIsToEn } from '../../utils/helpers'
import SubscriptionTableItem from './SubscriptionTableItem'
import { ArrOfIdAndName, Case, SubscriptionArray } from '../../types/interfaces'
import { Area } from '../../types/enums'
import SubscriptionTableAllItem from './SubscriptionTableAllItems'
import { GeneralSubscriptionArray } from '../../utils/dummydata'

export interface SubscriptionTableProps {
  data: Array<Case> | Array<ArrOfIdAndName>
  currentTab: Area
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (obj: SubscriptionArray) => void
}

const Headers = {
  Mál: ['Málsnr.', 'Heiti máls', 'Málsnúmer og heiti máls'],
  Stofnanir: ['Stofnun'],
  Málefnasvið: ['Málefnasvið'],
}

const SubscriptionTable = ({
  data,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
}: SubscriptionTableProps) => {
  const onCheckboxChange = (id: string | number, action: boolean) => {
    const sub = [...subscriptionArray[mapIsToEn[currentTab]]]

    const subArr = { ...subscriptionArray }
    if (action) {
      sub.push(id)
    } else {
      const idx = sub.indexOf(id)
      sub.splice(idx, 1)
    }
    subArr[mapIsToEn[currentTab]] = sub
    return setSubscriptionArray(subArr)
  }
  const onAllChecked = (item, action) => {
    let sub = subscriptionArray['generalSubscription']
    const subArr = { ...subscriptionArray }
    if (action) {
      sub = item.id
    } else {
      sub = ''
    }
    subArr['generalSubscription'] = sub

    return setSubscriptionArray(subArr)
  }
  const checkboxStatus = (id: string | number) => {
    return subscriptionArray[mapIsToEn[currentTab]].includes(id)
  }
  const checkboxAllStatus = (id: string | number) => {
    return subscriptionArray['generalSubscription'] == id
  }

  const paddingTop = [3, 3, 3, 5, 5] as ResponsiveSpace

  const { md: mdBreakpoint } = useBreakpoint()
  const { Table, Head, Row, HeadData, Body } = T

  return (
    <Box paddingTop={paddingTop}>
      <Table>
        <Head>
          <Row>
            <HeadData
              width="10"
              key={'tableHeaderKey_checkmark'}
              box={{
                background: 'transparent',
                borderColor: 'transparent',
              }}
            >
              <Icon
                icon="checkmark"
                color="blue400"
                className={styles.checkmarkIcon}
              />
            </HeadData>
            {currentTab !== Area.case ? (
              <HeadData
                text={{ variant: 'h4' }}
                key={'tableHeaderKey_0'}
                box={{
                  background: 'transparent',
                  borderColor: 'transparent',
                }}
              >
                {Headers[currentTab][0]}
              </HeadData>
            ) : mdBreakpoint ? (
              <>
                <HeadData
                  width="120"
                  text={{ variant: 'h4' }}
                  box={{
                    background: 'transparent',
                    borderColor: 'transparent',
                  }}
                  key={'tableHeaderKey_1'}
                >
                  {Headers[currentTab][0]}
                </HeadData>
                <HeadData
                  text={{ variant: 'h4' }}
                  box={{
                    background: 'transparent',
                    borderColor: 'transparent',
                  }}
                  key={'tableHeaderKey_2'}
                >
                  {Headers[currentTab][1]}
                </HeadData>
              </>
            ) : (
              <HeadData
                text={{ variant: 'h4' }}
                box={{ background: 'transparent', borderColor: 'transparent' }}
                key={'tableHeaderKey_3'}
              >
                {Headers[currentTab][2]}
              </HeadData>
            )}
          </Row>
        </Head>
        {data && data.length > 0 && (
          <Body>
            {GeneralSubscriptionArray.map((item, index) => {
              return (
                <SubscriptionTableAllItem
                  key={index}
                  item={item}
                  checkboxStatus={checkboxAllStatus}
                  onCheckboxChange={onAllChecked}
                  currentTab={currentTab}
                  mdBreakpoint={mdBreakpoint}
                />
              )
            })}
            {data.map((item, idx: number) => (
              <SubscriptionTableItem
                key={item.id}
                item={item}
                idx={idx}
                checkboxStatus={checkboxStatus}
                onCheckboxChange={onCheckboxChange}
                currentTab={currentTab}
                mdBreakpoint={mdBreakpoint}
              />
            ))}
          </Body>
        )}
      </Table>
    </Box>
  )
}

export default SubscriptionTable
