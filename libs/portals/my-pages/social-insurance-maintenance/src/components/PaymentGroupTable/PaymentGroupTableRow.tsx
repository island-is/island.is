import { Table as T, Box, Button, Text } from '@island.is/island-ui/core'

import * as styles from './PaymentGroupTable.css'
import { m } from '../../lib/messages'
import { useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { MONTHS, amountFormat } from '@island.is/portals/my-pages/core'
import { SocialInsurancePaymentGroup } from '@island.is/api/schema'
import cn from 'classnames'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  paymentGroup: SocialInsurancePaymentGroup
}

export const PaymentGroupTableRow = ({ paymentGroup }: Props) => {
  const { formatMessage } = useLocale()
  const [expanded, toggleExpand] = useState<boolean>(false)

  const { width } = useWindowSize()
  const isTablet = width < theme.breakpoints.lg

  const onExpandButton = () => {
    toggleExpand(!expanded)
  }

  return (
    <>
      <T.Row>
        <T.HeadData
          box={{
            className: cn(styles.rowLabelColumnCell, {
              [styles.expandedColumnCell]: expanded,
            }),
            background: expanded ? 'blue100' : 'white',
          }}
          scope="row"
        >
          <Box display="flex">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexStart"
              onClick={onExpandButton}
              cursor="pointer"
              paddingRight={isTablet ? 2 : 4}
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
            <Box paddingRight={isTablet ? 2 : undefined}>
              <Text variant="medium">{paymentGroup.name}</Text>
            </Box>
          </Box>
        </T.HeadData>
        {MONTHS.map((month, i) => {
          const amount = paymentGroup?.monthlyPaymentHistory?.find(
            (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
          )?.amount

          return (
            <T.Data
              key={`payment-group-table-row-value-cell-${i}`}
              box={{
                className: cn(styles.noWrap, {
                  [styles.expandedColumnCell]: expanded,
                }),
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
            className: cn(styles.lastColumnCell, styles.noWrap, {
              [styles.expandedColumnCell]: expanded,
            }),
            background: expanded ? 'blue100' : 'white',
          }}
        >
          <Text variant="medium" textAlign="right">
            {`${amountFormat(paymentGroup.totalYearCumulativeAmount)}`}
          </Text>
        </T.Data>
      </T.Row>
      {paymentGroup?.payments.map((pg, idx) => {
        const last = idx === paymentGroup.payments.length - 1

        return (
          <T.Row key={`payment-group-table-nested-row-${idx}`}>
            <T.HeadData
              box={{
                className: cn(
                  styles.reset,
                  styles.nestedLabelColumnCell,
                  styles.expandedColumnCell,
                  {
                    [styles.hidden]: !expanded,
                  },
                ),
                background: 'blue100',
                marginTop: 3,
              }}
              scope="row"
            >
              <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
                <Box
                  className={styles.nestedCell}
                  background={idx % 2 === 0 ? 'white' : 'blue100'}
                  paddingLeft={2}
                  marginLeft={2}
                  marginBottom={last ? 3 : 0}
                >
                  <Text variant="small">{pg.name}</Text>
                </Box>
              </AnimateHeight>
            </T.HeadData>
            {MONTHS.map((month) => {
              const amount = pg?.monthlyPaymentHistory?.find(
                (mph) => mph.monthIndex === MONTHS.indexOf(month) + 1,
              )?.amount

              return (
                <T.Data
                  key={`payment-group-table-nested-row-cell-${month}`}
                  box={{
                    className: cn(
                      styles.expandedColumnCell,
                      styles.noWrap,
                      styles.reset,
                      {
                        [styles.hidden]: !expanded,
                      },
                    ),
                    background: 'blue100',
                  }}
                >
                  <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
                    <Box
                      className={styles.nestedCell}
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
                className: cn(
                  styles.lastColumnCell,
                  styles.expandedColumnCell,
                  styles.reset,
                  styles.noWrap,
                  {
                    [styles.hidden]: !expanded,
                  },
                ),
                background: 'blue100',
              }}
            >
              <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
                <Box
                  className={styles.nestedCell}
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
