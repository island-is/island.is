import React from 'react'
import {
  Icon,
  Table as T,
  Box,
  ResponsiveSpace,
  Hidden,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import * as styles from './SubscriptionTable.css'
import { mapIsToEn } from '../../utils/helpers'
import SubscriptionTableItem from './SubscriptionTableItem'
import { ArrOfIdAndName, Case, SubscriptionArray } from '../../types/interfaces'
import { Area } from '../../types/enums'

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
  let headerKey = 0

  const onCheckboxChange = (id: number, action: boolean) => {
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

  const checkboxStatus = (id: number) => {
    return subscriptionArray[mapIsToEn[currentTab]].includes(id)
  }

  const paddingTop = [3, 3, 3, 5, 5] as ResponsiveSpace

  return (
    <Box paddingTop={paddingTop}>
      <GridRow>
        <GridColumn span={'12/12'}>
          <T.Table>
            <T.Head>
              <T.HeadData
                width="10"
                key={headerKey++}
                box={{ background: 'transparent', borderColor: 'transparent' }}
              >
                <Icon
                  icon="checkmark"
                  color="blue400"
                  className={styles.checkmarkIcon}
                />
              </T.HeadData>
              {currentTab !== Area.case ? (
                <T.HeadData
                  text={{ variant: 'h4' }}
                  box={{
                    background: 'transparent',
                    borderColor: 'transparent',
                  }}
                >
                  {Headers[currentTab][0]}
                </T.HeadData>
              ) : (
                <>
                  <T.HeadData
                    text={{ variant: 'h4' }}
                    box={{
                      background: 'transparent',
                      borderColor: 'transparent',
                    }}
                  >
                    <Hidden below="lg">{Headers[currentTab][0]}</Hidden>
                    <Hidden above="md">{Headers[currentTab][2]}</Hidden>
                  </T.HeadData>
                  <T.HeadData
                    text={{ variant: 'h4' }}
                    box={{
                      background: 'transparent',
                      borderColor: 'transparent',
                    }}
                  >
                    <Hidden below="lg">{Headers[currentTab][1]}</Hidden>
                  </T.HeadData>
                </>
              )}
            </T.Head>
            <T.Body>
              {data.map((item, idx: number) => (
                <SubscriptionTableItem
                  key={item.id}
                  item={item}
                  idx={idx}
                  checkboxStatus={checkboxStatus}
                  onCheckboxChange={onCheckboxChange}
                  currentTab={currentTab}
                />
              ))}
            </T.Body>
          </T.Table>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default SubscriptionTable
