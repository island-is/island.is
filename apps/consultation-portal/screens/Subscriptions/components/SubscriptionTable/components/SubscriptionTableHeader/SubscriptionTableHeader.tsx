import React from 'react'
import {
  Icon,
  Table as T,
  UseBoxStylesProps,
  useBreakpoint,
} from '@island.is/island-ui/core'
import * as styles from '../../SubscriptionTable.css'
import { Area } from '../../../../../../types/enums'
import { useIsMobile } from '../../../../../../hooks'

interface TableHeaderProps {
  currentTab: Area
}
const Headers = {
  Mál: ['Málsnr.', 'Heiti máls', 'Málsnúmer og heiti máls'],
  Stofnanir: ['Stofnun'],
  Málefnasvið: ['Málefnasvið'],
}

const SubscriptionTableHeader = ({ currentTab }: TableHeaderProps) => {
  const { Head, Row, HeadData } = T
  const { md: mdBreakpoint } = useBreakpoint()
  const { isMobile } = useIsMobile()
  const mobileBox = {
    background: 'transparent',
    borderColor: 'transparent',
    className: styles.paddingRightZero,
  } as UseBoxStylesProps
  const desktopBox = {
    ...mobileBox,
    width: 'touchable',
  } as UseBoxStylesProps
  const boxToUse = isMobile ? mobileBox : desktopBox

  return (
    <Head>
      <Row>
        <HeadData key={'tableHeaderKey_checkmark'} box={boxToUse}>
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
              text={{ variant: 'h4' }}
              box={{
                background: 'transparent',
                borderColor: 'transparent',
                width: 'touchable',
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
            box={{
              background: 'transparent',
              borderColor: 'transparent',
            }}
            key={'tableHeaderKey_3'}
          >
            {Headers[currentTab][2]}
          </HeadData>
        )}
      </Row>
    </Head>
  )
}
export default SubscriptionTableHeader
