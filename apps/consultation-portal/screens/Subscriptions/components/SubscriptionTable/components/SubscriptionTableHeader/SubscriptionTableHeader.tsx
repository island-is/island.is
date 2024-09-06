import React from 'react'
import {
  Icon,
  Inline,
  Table as T,
  TextProps,
  UseBoxStylesProps,
} from '@island.is/island-ui/core'
import { Area } from '../../../../../../types/enums'

import * as styles from '../../SubscriptionTable.css'

interface TableHeaderProps {
  currentTab: Area
}

const Headers = {
  Mál: 'Málsnúmer og heiti máls',
  Stofnanir: 'Stofnun',
  Málefnasvið: 'Málefnasvið',
}

const SubscriptionTableHeader = ({ currentTab }: TableHeaderProps) => {
  const { Head, Row, HeadData } = T
  const box = {
    background: 'transparent',
    borderColor: 'transparent',
    className: styles.paddingRightZero,
  } as UseBoxStylesProps
  const text = { variant: 'h4', whiteSpace: 'nowrap' } as TextProps

  return (
    <Head>
      <Row>
        <HeadData key={'tableHeaderKey'} box={box} text={text}>
          <Inline space={3} flexWrap="nowrap">
            <Icon
              icon="checkmark"
              color="blue400"
              className={styles.checkmarkIcon}
            />
            {Headers[currentTab]}
          </Inline>
        </HeadData>
      </Row>
    </Head>
  )
}
export default SubscriptionTableHeader
