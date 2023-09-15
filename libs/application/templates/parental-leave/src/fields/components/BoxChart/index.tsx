import React from 'react'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'

import * as styles from './BoxChart.css'
import { formatText } from '@island.is/application/core'
import { Application, FormText } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

type boxStyle =
  | 'blue'
  | 'green'
  | 'gray'
  | 'purple'
  | 'greenWithLines'
  | 'grayWithLines'
  | 'purpleWithLines'

export interface BoxChartKey {
  label: FormText
  bulletStyle: boxStyle
}

export interface BoxChartProps {
  application: Application
  titleLabel?: FormText
  boxes: number
  calculateBoxStyle: (index: number) => boxStyle
  keys?: BoxChartKey[]
}

/**************************************************
 Example usage:
 **************************************************

<BoxChart
    titleLabel="Total: 6 months *"
    boxes={6}
    calculateBoxStyle={(index: number) => {
        if (index === 6) return 'greenWithLines'
        return 'blue'
    }}
    keys={[
        {
            label: '5 personal months',
            bulletStyle: 'blue',
        },
        {
            label: '1 shared month given to other parent',
            bulletStyle: 'greenWithLines',
        },
    ]}
/>

***************************************************/

const BoxChart = ({
  application,
  boxes,
  calculateBoxStyle,
  keys,
  titleLabel,
}: BoxChartProps) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      {titleLabel && (
        <Text variant="h4" as="p">
          {typeof titleLabel === 'function'
            ? formatMessage(titleLabel(application) ?? '')
            : formatMessage(titleLabel)}
        </Text>
      )}
      <Box
        className={styles.BoxGrid}
        marginTop={1}
        style={{ gridTemplateColumns: `repeat(${boxes}, 1fr)` }}
      >
        {Array.from({ length: boxes }).map((_, index) => {
          const style = calculateBoxStyle(index)
          return (
            <Box
              className={cn(styles.box, {
                [styles.blue]: style === 'blue',
                [styles.green]: style === 'green' || style === 'greenWithLines',
                [styles.gray]: style === 'gray' || style === 'grayWithLines',
                [styles.purple]:
                  style === 'purple' || style === 'purpleWithLines',
              })}
              key={index}
            >
              {(style === 'greenWithLines' ||
                style === 'grayWithLines' ||
                style === 'purpleWithLines') && (
                <Box className={styles.dashedLines} />
              )}
            </Box>
          )
        })}
      </Box>
      {keys && (
        <Box marginTop={2}>
          {keys.map((key: BoxChartKey, index: number) => {
            const style = key.bulletStyle
            return (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flexStart"
                key={`boxChartBullet-${index}`}
              >
                <Box
                  marginRight={1}
                  className={cn(styles.bullet, {
                    [styles.blue]: style === 'blue',
                    [styles.purple]:
                      style === 'purple' || style === 'purpleWithLines',
                    [styles.green]:
                      style === 'green' || style === 'greenWithLines',
                    [styles.gray]:
                      style === 'gray' || style === 'grayWithLines',
                  })}
                >
                  {(style === 'greenWithLines' ||
                    style === 'grayWithLines' ||
                    style === 'purpleWithLines') && (
                    <Box className={styles.dashedLines} />
                  )}
                </Box>
                <Text variant="h5" as="span">
                  {formatText(key.label, application, formatMessage)}
                </Text>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default BoxChart
