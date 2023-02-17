import React from 'react'
import {
  Icon,
  Table as T,
  Box,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import * as styles from './SubscriptionTable.css'
import { mapIsToEn } from '../../utils/helpers'
import SubscriptionTableItem from './SubscriptionTableItem'

const Headers = {
  Mál: ['Málsnr.', 'Heiti máls'],
  Stofnanir: ['Stofnun'],
  Málefnasvið: ['Málefnasvið'],
}

const SubscriptionTable = ({
  data,
  currentTab,
  subscriptionArray,
  setSubscriptionArray,
}) => {
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

  const paddingTop = [3, 3, 3, 9] as ResponsiveSpace

  return (
    <Box paddingTop={paddingTop}>
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
          {Headers[currentTab].map((header) => (
            <T.HeadData
              text={{ variant: 'h4' }}
              box={{ background: 'transparent', borderColor: 'transparent' }}
              key={headerKey++}
            >
              {header}
            </T.HeadData>
          ))}
        </T.Head>
        <T.Body>
          {data.map((item, idx) => (
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
    </Box>
  )
}

export default SubscriptionTable
