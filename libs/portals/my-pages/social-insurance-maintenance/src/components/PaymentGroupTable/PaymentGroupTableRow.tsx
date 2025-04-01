import { Table as T, Box, Button, Text } from '@island.is/island-ui/core'

import * as styles from './PaymentGroupTable.css'
import { m } from '../../lib/messages'
import { useCallback, useState } from 'react'
import AnimateHeight, { Height } from 'react-animate-height'
import { MONTHS, amountFormat } from '@island.is/portals/my-pages/core'
import { SocialInsurancePaymentGroup } from '@island.is/api/schema'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'

interface Props {
  paymentGroup: SocialInsurancePaymentGroup
}

export const PaymentGroupTableRow = ({ paymentGroup }: Props) => {
  const { formatMessage } = useLocale()
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
            className: cn(styles.labelColumn, { [styles.column]: expanded }),
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
                title={formatMessage(m.breakdown)}
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
                className: cn({ [styles.column]: expanded }),
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
            className: cn(styles.sumColumn, { [styles.column]: expanded }),
            background: expanded ? 'blue100' : 'white',
          }}
        >
          <Text variant="medium">{`${amountFormat(
            paymentGroup.totalYearCumulativeAmount,
          )}`}</Text>
        </T.Data>
      </T.Row>
      {paymentGroup?.payments.map((pg, idx) => {
        const last = idx === paymentGroup.payments.length - 1

        return (
          <T.Row>
            <T.Data
              box={{
                className: cn(styles.subLabelColumn, styles.column, {
                  [styles.hidden]: !expanded,
                }),
                background: 'blue100',
                paddingRight: 0,
                paddingLeft: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 3,
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
                  className={styles.subCell}
                  background={idx % 2 === 0 ? 'white' : 'blue100'}
                  marginLeft={3}
                  paddingLeft={2}
                  paddingY={2}
                  marginBottom={last ? 3 : 0}
                >
                  <Text marginTop="auto" variant="small">
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
                    className: cn(styles.column, {
                      [styles.hidden]: !expanded,
                    }),
                    background: 'blue100',
                    paddingRight: 0,
                    paddingLeft: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
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
                      className={styles.subCell}
                      background={idx % 2 === 0 ? 'white' : 'blue100'}
                      paddingY={2}
                      paddingX={3}
                      justifyContent="flexEnd"
                      marginBottom={last ? 3 : 0}
                    >
                      <Text variant="small" textAlign="right">
                        {amount ? amountFormat(amount) : '-'}
                      </Text>
                    </Box>
                  </AnimateHeight>
                </T.Data>
              )
            })}
            <T.Data
              box={{
                className: cn(styles.sumColumn, styles.column, {
                  [styles.hidden]: !expanded,
                }),
                background: 'blue100',
                paddingRight: 0,
                paddingLeft: 0,
                paddingTop: 0,
                paddingBottom: 0,
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
                  className={styles.subCell}
                  background={idx % 2 === 0 ? 'white' : 'blue100'}
                  paddingX={2}
                  marginRight={3}
                  justifyContent={'flexEnd'}
                  marginBottom={last ? 3 : 0}
                >
                  <Text variant="small">
                    {`${amountFormat(pg.totalYearCumulativeAmount)}${
                      pg.markWithAsterisk ? ' *' : ''
                    }`}
                  </Text>
                </Box>
              </AnimateHeight>
            </T.Data>
          </T.Row>
        )
      })}
    </>
  )
}
