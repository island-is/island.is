import React, { ReactNode } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'

import { Box, Hyphen, Text } from '@island.is/island-ui/core'
import { ExportCSVButton } from '@island.is/web/components'

import {
  MixedChart,
  SimpleBarChart,
  SimpleLineChart,
  SimplePieChart,
} from '../'
import * as styles from './ChartsCard.css'

interface ChartCardDataProps {
  graphTitle?: string
  graphDescription?: string
  organization?: string
  data?: string
  datakeys?: string
  type?: string
}

export interface ChartsCardsProps {
  chart: ChartCardDataProps
  subPage?: boolean
}

export const ChartsCard: React.FC<
  React.PropsWithChildren<ChartsCardsProps>
> = ({ chart, subPage }) => {
  const { graphTitle, graphDescription, organization, type, data, datakeys } =
    chart
  const [ref, { width }] = useMeasure()
  const graphData = { title: graphTitle, data: data, datakeys: datakeys }

  let children = null
  switch (type) {
    case 'Mixed':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      children = <MixedChart graphData={graphData} />
      break
    case 'Line':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      children = <SimpleLineChart graphData={graphData} />
      break
    case 'Bar':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      children = <SimpleBarChart graphData={graphData} />
      break
    case 'Pie':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      children = <SimplePieChart graphData={graphData} />
      break
    default:
      break
  }

  const items = (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      flexGrow={1}
      alignItems="stretch"
      justifyContent="flexStart"
    >
      <Box
        className={cn(styles.outerWrapper, {
          [styles.pie]: type === 'Pie',
        })}
        background={subPage ? 'blue100' : 'purple100'}
      >
        <Box
          className={styles.innerWrapper}
          paddingBottom={4}
          display="flex"
          flexDirection="row"
          alignItems="center"
          padding={[2, 2, 2]}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            width="full"
          >
            <Box paddingLeft={1}>
              {organization && (
                <Text variant="eyebrow" color="dark400">
                  {organization}
                </Text>
              )}
              <Text variant="h3" color="dark400">
                {/*
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error make web strict */}
                <Hyphen>{graphTitle}</Hyphen>
              </Text>
              {graphDescription && (
                <Text color="dark400">{graphDescription}</Text>
              )}
            </Box>
            {subPage && (
              <Box padding={[2, 2, 4]}>
                <ExportCSVButton
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  data={data}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  title={graphTitle}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={cn(styles.graphWrapper, {
          [styles.pie]: type === 'Pie',
        })}
      >
        <Box
          justifyContent="center"
          alignItems="center"
          className={styles.graphParent}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
  return <FrameWrapper width={width}>{items}</FrameWrapper>
}

const FrameWrapper = ({
  width,
  children,
}: {
  width: number
  children: ReactNode
}) => {
  return (
    <Box
      className={cn(styles.frameWrapper, {
        [styles.scroll]: width < 800,
      })}
      borderColor="purple100"
      borderWidth="standard"
      borderRadius="large"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  )
}

export default ChartsCard
