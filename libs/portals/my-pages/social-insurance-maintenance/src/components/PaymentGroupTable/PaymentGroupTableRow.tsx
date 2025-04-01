import { Table as T, Box, Button, Text } from '@island.is/island-ui/core'

import * as styles from './PaymentGroupTable.css'
import { useCallback, useState } from 'react'
import AnimateHeight, { Height } from 'react-animate-height'
import { MONTHS, amountFormat } from '@island.is/portals/my-pages/core'
import { SocialInsurancePaymentGroup } from '@island.is/api/schema'
import cn from 'classnames'

interface Props {
  key: string
  paymentGroup: SocialInsurancePaymentGroup
}

export const PaymentGroupTableRow = ({ key, paymentGroup }: Props) => {
  const [expanded, toggleExpand] = useState<boolean>(false)
  const [closed, setClosed] = useState<boolean>(true)

  const handleAnimationEnd = useCallback((height: Height) => {
    if (height === 0) {
      setClosed(true)
    } else {
      setClosed(false)
    }
  }, [])

  const onExpandButton = () => {
    toggleExpand(!expanded)
  }

  return (
    <>
      <T.Row>
        <T.Data
          box={{
            className: styles.labelColumn,
            background: expanded ? 'blue100' : 'white',
          }}
        >
          <Box display="flex">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexStart"
              onClick={onExpandButton}
              cursor="pointer"
              paddingRight={4}
            >
              <Button
                circle
                colorScheme="light"
                icon={expanded ? 'remove' : 'add'}
                iconType="filled"
                onClick={onExpandButton}
                preTextIconType="filled"
                size="small"
                title={'Sundurliðun'}
                type="button"
                variant="primary"
              />
            </Box>
            <Text variant="medium">{paymentGroup.name}</Text>
          </Box>
        </T.Data>
        {MONTHS.map((month, i) => {
          const amount = paymentGroup?.monthlyPaymentHistory?.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month),
          )?.amount

          return (
            <T.Data
              key={i}
              box={{
                background: expanded ? 'blue100' : 'white',
              }}
              align="right"
            >
              <Text variant="medium">
                {amount ? amountFormat(amount) : '-'}
              </Text>
            </T.Data>
          )
        })}
        <T.Data
          box={{
            className: styles.sumColumn,
            background: expanded ? 'blue100' : 'white',
          }}
        >
          <Text variant="medium">{`${amountFormat(
            paymentGroup.totalYearCumulativeAmount,
          )}`}</Text>
        </T.Data>
      </T.Row>
      {paymentGroup?.payments.map((pg, idx) => (
        <T.Row>
          <T.Data
            box={{
              className: cn(styles.subLabelColumn, {
                [styles.hidden]: !expanded,
              }),
              paddingY: 0,
              paddingX: 0,
              background: 'blue100',
            }}
          >
            <AnimateHeight
              onHeightAnimationEnd={(newHeight) =>
                handleAnimationEnd(newHeight)
              }
              duration={300}
              height={expanded ? 'auto' : 0}
            >
              <Box
                paddingLeft={3}
                paddingY={2}
                background={idx % 2 === 0 ? 'white' : 'blue100'}
              >
                <Text variant="small" fontWeight="medium">
                  {pg.name}
                </Text>
              </Box>
            </AnimateHeight>
          </T.Data>
          {MONTHS.map((month) => {
            const amount = pg?.monthlyPaymentHistory?.find(
              (mph) => mph.monthIndex === MONTHS.indexOf(month),
            )?.amount

            return (
              <T.Data
                key={`nested-table-footer-col-${month}`}
                box={{
                  className: cn({
                    [styles.hidden]: !expanded,
                  }),
                  background: idx % 2 === 0 ? 'white' : 'blue100',
                }}
              >
                <AnimateHeight
                  onHeightAnimationEnd={(newHeight) =>
                    handleAnimationEnd(newHeight)
                  }
                  duration={300}
                  height={expanded ? 'auto' : 0}
                >
                  <Text variant="medium" fontWeight="medium" textAlign="right">
                    {amount ? amountFormat(amount) : '-'}
                  </Text>
                </AnimateHeight>
              </T.Data>
            )
          })}
          <T.Data
            box={{
              className: cn(styles.sumColumn, {
                [styles.hidden]: !expanded,
              }),
            }}
          >
            <AnimateHeight
              onHeightAnimationEnd={(newHeight) =>
                handleAnimationEnd(newHeight)
              }
              duration={300}
              height={expanded ? 'auto' : 0}
            >
              <Box background={idx % 2 === 0 ? 'white' : 'blue100'}>
                <Text variant="medium" fontWeight="medium">
                  {`${amountFormat(pg.totalYearCumulativeAmount)}${
                    pg.markWithAsterisk ? ' *' : ''
                  }`}
                </Text>
              </Box>
            </AnimateHeight>
          </T.Data>
        </T.Row>
      ))}
    </>
  )
}
